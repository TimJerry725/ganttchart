import { useState, useRef } from 'react';
import { Gantt } from '../components/Gantt/Gantt';
import type { TaskDragUpdatePayload } from '../components/Gantt/types';
import { basicTasks, basicLinks } from './data';

export default {
    title: 'Gantt/Drag Drop API Integration',
    component: Gantt,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

// ─── Mock API helpers ────────────────────────────────────────────────────────

/** Simulate a backend API call for task drag (move / resize) updates */
const mockTaskDragUpdateAPI = async (payload: TaskDragUpdatePayload): Promise<{ success: boolean; message: string }> => {
    // Simulate network latency (300–800ms)
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));

    // Simulate a 10% failure rate to test error handling
    if (Math.random() < 0.1) {
        throw new Error('Network error: failed to update task on server');
    }

    return {
        success: true,
        message: `Task "${payload.task.text}" (id: ${payload.task.rawId ?? payload.task.id}) updated via ${payload.dragType}`,
    };
};



// ─── Log entry type ──────────────────────────────────────────────────────────

interface LogEntry {
    id: number;
    timestamp: string;
    type: 'drag' | 'reorder' | 'error';
    message: string;
    payload?: unknown;
}

// ─── Story component ─────────────────────────────────────────────────────────

const DragDropWithAPI = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const logIdRef = useRef(0);

    const addLog = (type: LogEntry['type'], message: string, payload?: unknown) => {
        const entry: LogEntry = {
            id: logIdRef.current++,
            timestamp: new Date().toLocaleTimeString(),
            type,
            message,
            payload,
        };
        setLogs((prev) => [entry, ...prev].slice(0, 50)); // keep last 50
    };

    /** 
     * Single callback for ALL drag operations:
     * - dragType 'move' / 'resize-left' / 'resize-right' → task bar was dragged on the timeline
     * - dragType 'reorder' → task row was reordered via grip icon (includes reorderMeta)
     */
    const handleTaskDragUpdate = async (payload: TaskDragUpdatePayload) => {
        const { task, previousTask, dragType, reorderMeta } = payload;
        const logType = dragType === 'reorder' ? 'reorder' : 'drag';

        const logPayload: Record<string, unknown> = {
            taskId: task.rawId ?? task.id,
            dragType,
        };

        if (dragType === 'reorder' && reorderMeta) {
            logPayload.currentSequenceId = reorderMeta.currentSequenceId;
            logPayload.targetSequenceId = reorderMeta.targetSequenceId;
            logPayload.targetStageId = reorderMeta.targetStageId;
            logPayload.previousParent = previousTask.parent ?? 'root';
            logPayload.newParent = task.parent ?? 'root';
        } else {
            logPayload.previous = {
                start: previousTask.start.toISOString(),
                end: previousTask.end.toISOString(),
                duration: previousTask.duration,
            };
            logPayload.updated = {
                start: task.start.toISOString(),
                end: task.end.toISOString(),
                duration: task.duration,
            };
        }

        addLog(logType, `⏳ Sending ${dragType} update for "${task.text}" to API...`, logPayload);

        try {
            const result = await mockTaskDragUpdateAPI(payload);
            addLog(logType, `✅ ${result.message}`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            addLog('error', `❌ ${message}`);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Gantt chart */}
            <div style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
                <Gantt
                    tasks={basicTasks as any}
                    links={basicLinks}
                    config={{ weekends: true, theme: 'light' }}
                    onTaskDragUpdate={handleTaskDragUpdate}
                />
            </div>

            {/* API Log panel */}
            <div
                style={{
                    flex: '0 0 240px',
                    borderTop: '2px solid #e0e0e0',
                    background: '#1e1e1e',
                    color: '#d4d4d4',
                    fontFamily: "'Fira Code', 'Consolas', monospace",
                    fontSize: '12px',
                    overflow: 'auto',
                    padding: '8px 12px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                        borderBottom: '1px solid #444',
                        paddingBottom: '6px',
                    }}
                >
                    <span style={{ color: '#569cd6', fontWeight: 600, fontSize: '13px' }}>
                        📡 API Integration Log
                    </span>
                    <button
                        onClick={() => setLogs([])}
                        style={{
                            background: '#333',
                            color: '#ccc',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            padding: '2px 8px',
                            cursor: 'pointer',
                            fontSize: '11px',
                        }}
                    >
                        Clear
                    </button>
                </div>

                {logs.length === 0 && (
                    <div style={{ color: '#888', fontStyle: 'italic', padding: '16px 0', textAlign: 'center' }}>
                        Drag a task bar to move/resize, or drag the grip icon to reorder. API calls will appear here.
                    </div>
                )}

                {logs.map((log) => (
                    <div
                        key={log.id}
                        style={{
                            padding: '4px 0',
                            borderBottom: '1px solid #2a2a2a',
                            lineHeight: '1.5',
                        }}
                    >
                        <span style={{ color: '#888' }}>[{log.timestamp}]</span>{' '}
                        <span
                            style={{
                                color:
                                    log.type === 'error'
                                        ? '#f44747'
                                        : log.type === 'reorder'
                                            ? '#dcdcaa'
                                            : '#4ec9b0',
                            }}
                        >
                            {log.message}
                        </span>
                        {log.payload && (
                            <pre
                                style={{
                                    margin: '2px 0 0 20px',
                                    padding: '4px 8px',
                                    background: '#252526',
                                    borderRadius: '3px',
                                    fontSize: '11px',
                                    color: '#ce9178',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {JSON.stringify(log.payload, null, 2)}
                            </pre>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Storybook exports ───────────────────────────────────────────────────────

export const WithMockAPI = {
    render: () => <DragDropWithAPI />,
    parameters: {
        docs: {
            description: {
                story: `
Demonstrates the unified **onTaskDragUpdate** API integration for ALL drag operations.

- **Move a task bar** left/right → \`dragType: 'move'\`
- **Resize a task bar** from left/right edge → \`dragType: 'resize-left' | 'resize-right'\`
- **Reorder a task row** via the grip icon → \`dragType: 'reorder'\` with \`reorderMeta\` containing sequence/stage info

The log panel below the Gantt shows mock API calls with request/response data.
A simulated 10% failure rate demonstrates error handling.
        `,
            },
        },
    },
};
