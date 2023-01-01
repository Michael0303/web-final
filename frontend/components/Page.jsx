import { useUser } from '../components/hooks/useUser'
import Title from '../components/Title'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components';
import axios from '../components/api';
import { Button, Menu, Space } from 'antd';
import DirModal from '../components/DirModal'
import FileModal from '../components/FileModal'
import folderPic from '../pic/folderPic.png'
import filePic from '../pic/filePic.png'
import Image from 'next/image'
import Function from './Function'
import Logout from './Logout'
import Background from './Background'
import DashBoard from './DashBoard'
import MenuModal from '../components/MenuModal'

const MainWrapper = styled.div`
    height: 75vh;
    width: auto;
    min-width: 80vw;
    display: flex;
    flex-direction: column;
`

const PathWrapper = styled(Space)`
    /* background-color: green; */
    height: 5vh;
    display: flex;
    justify-content: flex-start;
    /* padding-left: 1vw; */
    align-items: flex-start;
    & > h1 {
        display: flex;
        align-items: center;
        margin:0px;
        /* border: 0.1vmin solid white; */
        box-shadow: inset 0px 0px 0px 0.2vmin white;
    }
`

const StorageWrapper = styled.span`
    /* background-color: purple; */
    height:75vh;
    display:flex;
    flex-wrap: wrap;
    justify-content:flex-start;
    align-content:flex-start;
    border-radius: 1vw;
    box-shadow: inset 0px 0px 0px 0.2vmin white;
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

export default function Page() {
    const { username, signedIn, privileged, user, setSignedIn, status, setStatus } = useUser()
    const router = useRouter()
    const [dir, setDir] = useState([])
    const [file, setFile] = useState([])
    const [DirmodalOpen, setDirModalOpen] = useState(false)
    const [fileModalOpen, setFileModalOpen] = useState(false)
    const [change, setChange] = useState(false)
    const [menuModalOpen, setMenuModalOpen] = useState(false)
    const [target, setTarget] = useState(undefined)
    const [mode, setMode] = useState("file")

    const { curPathHash } = router.query;
    let curPath = "";
    if (typeof window !== 'undefined' && signedIn) {
        if (curPathHash) {
            curPath = window.atob(curPathHash);
        }
    }

    useEffect(() => {
        if (!signedIn) {
            router.push("/signin")
        }
    }, [signedIn])

    useEffect(() => {
        // if(typeof window !== 'undefined')
        //     curPath = window.atob(curPathHash);
        if (signedIn)
            getDir(curPath);
    }, [curPathHash])

    useEffect(() => {
        if (change) {
            getDir(curPath)
            //getFile()
            setChange(false)
        }
    }, [change])

    const getDir = async (dirName) => {
        const { data: { status, directory } } = await axios.get('/api/directory', { params: { path: dirName } })
        let tmpDir = []
        let tmpFile = []
        for (const key in directory) {
            if (directory[key].isDirectory)
                tmpDir.push(directory[key].name)
            else
                tmpFile.push(directory[key].name)
        }
        setDir(tmpDir)
        setFile(tmpFile)
    }

    const createDir = async ({ name }) => {
        const { data: { status } } = await axios.post('/api/directory/create', { path: curPath + "/" + name })
        setDirModalOpen(false)
        setChange(true)
    }


    const redirect = (e) => {
        let hash = "";
        if (typeof window !== 'undefined')
            hash = window.btoa(curPath + "/" + e);
        router.push("/directory/" + hash)
    }

    const contextMenuHandler = async (e) => {
        setTarget(e)
        setMode("directory")
        setMenuModalOpen(true)
    }

    const fileCilckHandler = async (e) => {
        setTarget(e)
        setMode("file")
        setMenuModalOpen(true)

    }

    return (
        <div style={{ backgroundColor: "pink" }}>
            {!signedIn ? <Title title={"Sign In First"} /> :
                <>
                    <Title title={username + "'s Cloud"} user={user} />
                    <Background>
                        <Function>
                            <Button onClick={() => { setFileModalOpen(true) }}> Upload file</Button>
                            <Button onClick={() => { setDirModalOpen(true) }}> Create directory </Button>
                            <Logout />
                            {privileged ? <DashBoard /> : null}
                        </Function>
                        <MainWrapper>
                            <PathWrapper>
                                <Button disabled={!curPath} size="large" onClick={() => { router.back() }}>Back</Button>
                                <h1>{`Now at: ` + (curPath ? curPath : "/")}</h1>
                            </PathWrapper>
                            <StorageWrapper>
                                {dir.map((e, idx) => {
                                    return (
                                        <div key={idx + e}
                                            onContextMenu={(event) => {
                                                event.preventDefault()
                                                contextMenuHandler(e)
                                            }}
                                            onClick={() => { redirect(e) }} className={"directory"} style={{ display: "flex", width: "15vw", height: "6vh", border: "2px solid black", margin: "20px", alignContent: "center", borderRadius: "0.5rem" }}>
                                            <div style={{ width: "18%" }}>
                                                <Image src={folderPic} alt="Picture of the folder" style={{ height: "100%", width: "100%" }} />
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexGrow: "1" }}>{e}</div>
                                        </div>
                                    )
                                })}
                                {file.map((e, idx) => {
                                    return (
                                        <div key={idx + e} className={"file"} onClick={() => { fileCilckHandler(e) }} style={{ display: "flex", width: "15vw", height: "6vh", border: "2px solid black", margin: "20px", alignContent: "center", borderRadius: "0.5rem" }}>
                                            <div style={{ width: "18%", display: "flex", alignItems: "center" }}>
                                                <Image src={filePic} alt="Picture of the file" style={{ height: "75%", width: "75%" }} />
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexGrow: "1" }}>{e}</div>
                                        </div>
                                    )
                                })}
                            </StorageWrapper>
                        </MainWrapper>
                    </Background>
                    <DirModal open={DirmodalOpen} onCancel={() => { setDirModalOpen(false) }} onCreate={createDir} />
                    <FileModal open={fileModalOpen} onCancel={() => { setFileModalOpen(false) }} curPath={curPath} setChange={setChange} />
                    <MenuModal open={menuModalOpen} onCancel={() => { setMenuModalOpen(false) }} target={target} curPath={curPath} setChange={setChange} mode={mode} />
                </>
            }
        </div>
    )
}

