import { useRouter } from "next/router"
import { useEffect, useState, useRef } from "react";
import axios from "../../components/api"
import Title from "../../components/Title";
import Background from "../../components/Background";
import Function from "../../components/Function";
import Link from "next/link";
import styled from "styled-components";
import { Button, Space } from "antd";
import FileModal from "../../components/modals/FileModal"
import MenuModal from "../../components/modals/MenuModal"
import MoveModal from "../../components/modals/MoveModal"
import DirModal from "../../components/modals/DirModal"
import filePic from "../../pic/filePic.png"
import folderPic from "../../pic/folderPic.png"
import Image from "next/image"

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
    
`
const Tag = styled.h1`
    display: flex;
    align-items: center;
    margin:0px;
    /* border: 0.1vmin solid white; */
    &:hover{
        background-color:#645858;
        color:white;
        border-radius:0.8rem;
        cursor:pointer;
    }
    &:-moz-drag-over{
        color:red;
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

export default function Share() {
    // const { username, signedIn, privileged, user, setUser, setSignedIn, status, setStatus } = useUser()
    const router = useRouter()
    const [dir, setDir] = useState([])
    const [file, setFile] = useState([])
    const [DirmodalOpen, setDirModalOpen] = useState(false)
    const [fileModalOpen, setFileModalOpen] = useState(false)
    const [change, setChange] = useState(false)
    const [menuModalOpen, setMenuModalOpen] = useState(false)
    const [moveModalOpen, setMoveModalOpen] = useState(false)
    const [target, setTarget] = useState(undefined)
    const [mode, setMode] = useState("file")
    const [curPath, setCurPath] = useState(undefined)
    const { sharedID } = router.query;
    const [load, setLoad] = useState(false)
    const [root, setRoot] = useState(undefined)

    useEffect(() => {
        if (sharedID) {
            setLoad(true)
        }
    })
    useEffect(() => {
        if (load) {
            const getLink = async () => {
                console.log(`try get link: ${sharedID}`)
                const { data: { link } } = await axios.get("/api/user/share", {
                    params: {
                        sharedID
                    }
                })
                const { username, target } = link
                setCurPath(target)
                setRoot(target)
            }
            getLink()
        }
    }, [load])


    const dragItem = useRef();
    const dropItem = useRef();



    const dragStart = (e, name, isDirectory) => {
        dragItem.current = { name: name, isDirectory: isDirectory };
    };

    const drop = (e, name, isDirectory) => {
        dropItem.current = { name: curPath + "/" + name, isDirectory: isDirectory };
        if (dropItem.current.name !== curPath + "/" + dragItem.current.name && dropItem.current.isDirectory)
            setMoveModalOpen(true);
    }


    useEffect(() => {
        // if(typeof window !== "undefined")
        //     curPath = window.atob(curPathHash);
        if (curPath)
            getDir(curPath);
    }, [curPath])

    useEffect(() => {
        if (change) {
            getDir(curPath)
            //getFile()
            // getUsage()
            setChange(false)
        }
    }, [change])

    // const getUsage = async () => {
    //     const { data: { usage } } = await axios.get("/api/user/usage")
    //     setUser({ ...user, usage })
    // }

    const getDir = async (dirName) => {
        const { data: { status, directory } } = await axios.get("/api/directory", { params: { path: dirName } })
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
        const { data: { status } } = await axios.post("/api/directory/create", { path: curPath + "/" + name })
        setDirModalOpen(false)
        setChange(true)
    }


    const redirect = (e) => {
        setCurPath(curPath + "/" + e)
        // setChange(true)
    }

    const back = (e) => {
        setCurPath(curPath.substring(0, curPath.lastIndexOf('/')))
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
            <Title title={"Share Cloud"} />
            {curPath ?
                <>
                    <Background>
                        <Function>
                            <Button onClick={() => { setFileModalOpen(true) }}> Upload file</Button>
                            <Button onClick={() => { setDirModalOpen(true) }}> Create directory </Button>
                            <Button onClick={() => router.replace("/")}><Link href="/">Exit</Link></Button>
                        </Function>
                        <MainWrapper>
                            <PathWrapper>
                                <Button disabled={curPath === root} size="large" onClick={() => { back() }}>Back</Button>
                                <h1> &nbsp;{`Now at: ` + (curPath ? curPath : "/")}</h1>
                                {/* <h1> &nbsp;Now at: </h1>
                                <Tag onClick={() => { router.push("/") }}
                                    className={"tag"}
                                    onDragOver={(event) => { event.stopPropagation(); event.preventDefault(); }}
                                    onDrop={(event) => {
                                        dropItem.current = { name: "/", isDirectory: true };
                                        if (curPath)
                                            setMoveModalOpen(true);
                                    }}
                                > Home </Tag>
                                {curPath.split("/").map((e, idx) => {
                                    return (idx === 0) ? null
                                        : <>
                                            <h1>{">"}</h1>
                                            <Tag key={idx}
                                                onClick={() => {
                                                    let path = "";
                                                    curPath.split("/").forEach((e, index) => { if (index !== 0 && index <= idx) path = path + "/" + e; })
                                                    let hash = "";
                                                    if (typeof window !== "undefined")
                                                        hash = window.btoa(path);
                                                    router.push("/directory/" + hash)
                                                }}
                                                onDragOver={(event) => { event.stopPropagation(); event.preventDefault(); }}
                                                onDrop={(event) => {
                                                    let path = "";
                                                    curPath.split("/").forEach((e, index) => { if (index !== 0 && index <= idx) path = path + "/" + e; })
                                                    dropItem.current = { name: path, isDirectory: true };
                                                    if (curPath !== path)
                                                        setMoveModalOpen(true);
                                                }}
                                            > {e} </Tag>
                                        </>
                                })} */}
                            </PathWrapper>
                            <StorageWrapper>
                                {dir.map((e, idx) => {
                                    return (
                                        <div key={e}
                                            onDragStart={(event) => dragStart(event, e, true)}
                                            onDragOver={(event) => { event.stopPropagation(); event.preventDefault(); }}
                                            onDrop={(event) => drop(event, e, true)}
                                            draggable
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
                                        <div onDragStart={(event) => dragStart(event, e, false)}
                                            onDragOver={(event) => { event.stopPropagation(); event.preventDefault(); }}
                                            onDrop={(event) => drop(event, e, false)}
                                            draggable
                                            key={e} className={"file"} onClick={() => { fileCilckHandler(e) }} style={{ display: "flex", width: "15vw", height: "6vh", border: "2px solid black", margin: "20px", alignContent: "center", borderRadius: "0.5rem" }}>
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
                    <MoveModal open={moveModalOpen} onCancel={() => { setMoveModalOpen(false) }} target={dragItem.current ? dragItem.current.name : ""} dst={dropItem.current ? dropItem.current.name : ""} curPath={curPath ? curPath : "/"} setChange={setChange} />
                </> : null}
        </div>
    )
}
