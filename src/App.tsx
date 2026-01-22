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
          weekends: true
        }}
      />
    </div>
  )
}

export default App
