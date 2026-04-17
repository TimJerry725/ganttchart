import { Gantt } from './components/Gantt/Gantt'
import { basicTasks, basicLinks } from './stories/data'
import './components/Gantt/gantt.css'
import './App.css'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Gantt
        tasks={basicTasks}
        links={basicLinks}
        config={{
          theme: 'light',
          weekends: true,
          timelineView: 'day',
          timelineViews: ['day', 'week', 'month'],
          timelineViewScales: {
            day: [
              { unit: 'month', step: 1, format: 'MM YYYY' },
              { unit: 'day', step: 2, format: 'D' },
            ],
            week: [
              { unit: 'month', step: 1, format: 'MM YYYY' },
              { unit: 'week', step: 2, format: 'Week W' },
            ],
            month: [
              { unit: 'year', step: 1, format: 'YYYY' },
              { unit: 'month', step: 2, format: 'MM' },
            ],
          },
        }}
      />
    </div>
  )
}

export default App
