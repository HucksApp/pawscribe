import React,{useState} from 'react'
import Appbar from './Appbar'
import FileList from './FileList'
import Footer from './Footer'

const Dashboard = () => {
  const [searchValue, setSearchValue] = useState("")
  const [stateChanged, setStateChange] = useState(false) // manually triger state change

  return (
    <div className='dashboard filedashboard'>
        <Appbar setSearchValue={setSearchValue}/>
        <FileList searchValue={searchValue} setStateChange={setStateChange} stateChanged={stateChanged} />
        <Footer/>
    </div>
  )
}

export default Dashboard