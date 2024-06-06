import React,{useState} from 'react'
import Appbar from './Appbar'
import FileList from './FileList'
import TextList from './TextList'
import Footer from './Footer'
import '../css/dashboard.css'

const Dashboard = () => {
  const [searchValue, setSearchValue] = useState("")
  const [stateChanged, setStateChange] = useState(false) // manually triger state change

  return (
    <div className='dashboard'>
        <Appbar setSearchValue={setSearchValue}/>
        <FileList searchValue={searchValue} setStateChange={setStateChange} stateChanged={stateChanged} />
        <TextList searchValue={searchValue}  setStateChange={setStateChange} stateChanged={stateChanged} />
        <Footer/>
    </div>
  )
}

export default Dashboard