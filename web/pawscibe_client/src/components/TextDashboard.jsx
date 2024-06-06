import React,{useState} from 'react'
import Appbar from './Appbar'
import TextList from './TextList'
import Footer from './Footer'
const Dashboard = () => {
  const [searchValue, setSearchValue] = useState("")
  const [stateChanged, setStateChange] = useState(false) // manually triger state change

  return (
    <div className='dashboard textdashboard'>
        <Appbar setSearchValue={setSearchValue}/>
        <TextList searchValue={searchValue} setStateChange={setStateChange} stateChanged={stateChanged}  />
        <Footer/>
    </div>
  )
}

export default Dashboard