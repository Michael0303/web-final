import { Inter } from '@next/font/google'
import { useUser } from '../../components/hooks/useUser'
import Title from '../../components/Title'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect,useState } from 'react'
import styled from 'styled-components';
import axios from '../../components/api';
import Button from '@material-ui/core/Button';
import DirModal from '../../components/DirModal'
import FileModal from '../../components/FileModal'
import folderPic from '../../pic/folderPic.png'
import filePic from '../../pic/filePic.png'

import Image from 'next/image'



const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const { username,signedIn,setSignedIn,status,setStatus } = useUser()
    const router = useRouter()
    const [dir,setDir] = useState([])
    const [file,setFile] = useState([])
    const [DirmodalOpen,setDirModalOpen] = useState(false)
    const [fileModalOpen,setFileModalOpen] = useState(false)
    const [change,setChange] = useState(false)

    const {curPathHash} = router.query;

    if (!signedIn && process.browser) {
        router.push("/SignIn")
    }


    let curPath = "";
    if(typeof window !== 'undefined' && signedIn)
            curPath = window.atob(curPathHash);

    useEffect(()=>{
        // if(typeof window !== 'undefined')
        //     curPath = window.atob(curPathHash);
        if(signedIn)
            getDir(curPath);
    },[curPathHash])
    
    useEffect(()=>{
        if(change){
            getDir(curPath)
            //getFile()
            setChange(false)
        }
    },[change])
    
    const getDir = async(dirName)=>{
        const {data:{status,directory}} = await axios.get('/api/directory', {params:{path: dirName}})
        console.log(status)
        let tmpDir = []
        let tmpFile = []
        for(const key in directory){
            if(directory[key].isDirectory)
                tmpDir.push(directory[key].name)
            else
                tmpFile.push(directory[key].name)
        }
        setDir(tmpDir)
        setFile(tmpFile)
    }

    const createDir = async({name})=>{
        const {data:{status}} = await axios.post('/api/directory/create',{path:curPath+ "/" + name})
        setDirModalOpen(false)
        setChange(true)
        console.log(status)
    }


    const FunctionWrapper = styled.span`
        height: 30vh;
        width: 10%;
        // border: 2px solid blue;
        flex-wrap: wrap;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        & > Button{
            margin:0px;
        }
    `

    const Background = styled.div`
        display:flex;
        justify-content: flex-start;
        align-items: flex-start;
    `
    const StorageWrapper = styled.span`
        display:flex;
        height:100vh;
        width:90%;
        flex-wrap: wrap;
        justify-content:flex-start;
        align-content:flex-start;
        & > .directory:hover{
            background-color:gray;
            color:white;
            cursor:pointer;
        }
        & > .file:hover{
            background-color:gray;
            color:white;
            cursor:pointer;
        }
    `
    console.log(curPath)

    const redirect = (e)=>{
        let hash = "";
        if(typeof window !== 'undefined')
            hash = window.btoa(curPath + "/" + e);
        router.push("/directory/" + hash)
    }
    
    return (
        <>
            {!signedIn ? <Title title={"Sign In First"} /> :
                <>
                    <Title title={username + "'s Cloud"} />
                    <Background>
                        <FunctionWrapper>
                            <Button onClick={()=>{setFileModalOpen(true)}}> Upload File</Button>
                            <Button onClick={()=>{setDirModalOpen(true)}}> create directory </Button>
                            <Link href={"/SignIn"} onClick={() => setSignedIn(false)}>Log out</Link>
                        </FunctionWrapper>
                        <StorageWrapper>
                            {dir.map((e)=>{return (
                                <div onClick={()=>{redirect(e)}} className={"directory"}  style={{display:"flex",width:"15vw",height:"6vh",border:"2px solid black",margin:"20px",alignContent:"center",borderRadius:"0.5rem"}}>
                                    <div style={{width:"18%"}}>
                                        <Image src={folderPic} alt="Picture of the folder" style={{height:"100%",width:"100%"}}/>
                                    </div>
                                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexGrow:"1"}}>{e}</div>
                                </div>
                            )})}
                            {file.map((e,idx)=>{return (
                                <div key={idx + e} className={"file"} onClick={()=>{console.log(e)}} style={{display:"flex",width:"15vw",height:"6vh",border:"2px solid black",margin:"20px",alignContent:"center",borderRadius:"0.5rem"}}>
                                    <div style={{width:"18%",display:"flex",alignItems:"center"}}>
                                        <Image src={filePic} alt="Picture of the file" style={{height:"75%",width:"75%"}}/>
                                    </div>
                                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexGrow:"1"}}>{e}</div>
                                </div>
                            )})}
                        </StorageWrapper>
                    </Background>
                    <DirModal open={DirmodalOpen} onCancel={()=>{setDirModalOpen(false)}} onCreate={createDir} />
                    <FileModal open={fileModalOpen} onCancel={()=>{setFileModalOpen(false)}} curPath={curPath} setChange={setChange} />
                </>
            }
        </>
    )
}

