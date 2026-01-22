/**
 * Simple Example - Copy this into your project to get started!
 * 
 * Make sure you've installed:
 * npm install iris-gantt react react-dom antd dayjs @fortawesome/react-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
 */

import React, { useState } from 'react'
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'
import type { Task, Link } from 'iris-gantt'

function MyGanttChart() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      text: 'Project Setup',
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 10),
      duration: 9,
      progress: 100,
      type: 'project',
      open: true,
    },
    {
      id: '2',
      text: 'Design Phase',
      start: new Date(2024, 0, 11),
      end: new Date(2024, 0, 25),
      duration: 14,
      progress: 75,
      parent: '1',
      owner: 'Alice',
      priority: 'high',
    },
    {
      id: '3',
      text: 'Development',
      start: new Date(2024, 0, 26),
      end: new Date(2024, 1, 15),
      duration: 20,
      progress: 30,
      parent: '1',
      owner: 'Bob',
      priority: 'high',
    },
  ])

  const [links, setLinks] = useState<Link[]>([
    { id: 'l1', source: '2', target: '3', type: 'e2s' },
  ])

  return (
    <div style={{ height: '600px', padding: '20px' }}>
      <Gantt
        tasks={tasks}
        links={links}
        config={{
          theme: 'light',
          weekends: true,
          criticalPath: true,
        }}
        onTaskUpdate={(task) => {
          setTasks(prev => prev.map(t => t.id === task.id ? task : t))
          console.log('Task updated:', task)
        }}
        onTaskCreate={(task) => {
          setTasks(prev => [...prev, task])
          console.log('Task created:', task)
        }}
        onTaskDelete={(id) => {
          setTasks(prev => prev.filter(t => t.id !== id))
          setLinks(prev => prev.filter(l => l.source !== id && l.target !== id))
          console.log('Task deleted:', id)
        }}
        onLinkCreate={(link) => {
          setLinks(prev => [...prev, link])
          console.log('Link created:', link)
        }}
        onLinkDelete={(id) => {
          setLinks(prev => prev.filter(l => l.id !== id))
          console.log('Link deleted:', id)
        }}
      />
    </div>
  )
}

export default MyGanttChart
