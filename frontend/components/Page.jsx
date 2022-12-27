import { useUser } from '../components/hooks/useUser'
import Title from '../components/Title'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components';
import axios from '../components/api';
import Button from '@material-ui/core/Button';
import DirModal from '../components/DirModal'
import folder from '../pic/folderPic.png'
import Image from 'next/image'

const FunctionWrapper = styled.span`
    height: 70vh;
    width: 10%;
    border: 2px solid blue;
    flex-wrap: wrap;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    & > Button{
        margin:0px;
    }
`

const Background = styled.div`
    height: 70vh;
    background-color: pink;
    display:flex;
    justify-content: flex-start;
    align-items: flex-start;
`

const StorageWrapper = styled.span`
    display:flex;
    height:70vh;
    width:90%;
    flex-wrap: wrap;
    justify-content:flex-start;
    align-content:flex-start;
    & > .directory:hover{
        background-color:gray;
        color:white;
        cursor:pointer;
    }
`

const DirectoryWrapper = styled.div`
    display:flex;
    width:15vw;
    height:6vh;
    border:2px solid black;
    margin:20px;
    align-content:center;
    border-radius:0.5rem;
`

export default function Page() {
    const { username, signedIn, privileged, setSignedIn, status, setStatus } = useUser()
    const router = useRouter()
    const [dir, setDir] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [change, setChange] = useState(false)

    const { curPathHash } = router.query;
    console.log(curPathHash)
    let curPath = "";
    if (typeof window !== 'undefined' && signedIn) {
        if (!curPathHash) {
            curPath = "/"
        } else {
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
            getDir()
            //getFile()
            setChange(false)
        }
    }, [change])

    const getDir = async () => {
        const { data: { status, directory } } = await axios.get('/api/directory', { path: '/' })
        console.log(status)
        let tmp = []
        for (const key in directory)
            tmp.push(directory[key].name)
        setDir(tmp)
    }

    const createDir = async ({ name }) => {
        const { data: { status } } = await axios.post('/api/directory/create', { path: name })
        setModalOpen(false)
        setChange(true)
        console.log(status)
    }

    const handleLogout = () => {
        setSignedIn(false)
        axios.post('/api/user/logout')
    }


    const redirect = (e) => {
        let hash = "";
        if (typeof window !== 'undefined')
            hash = window.btoa(e);
        router.push("/directory/" + hash)
    }


    return (
        <div style={{ backgroundColor: "pink" }}>
            {!signedIn ? <Title title={"Sign In First"} /> :
                <>
                    <Title title={username + "'s Cloud"} />
                    <Background>
                        <FunctionWrapper>
                            <Button onClick={getDir}> testing</Button>
                            <Button onClick={() => { setModalOpen(true) }}> create directory </Button>
                            <Link href={"/signin"} onClick={() => handleLogout()}>Log out</Link>
                            {privileged ? <Link href={"/admin"}>Dashboard</Link> : null}
                        </FunctionWrapper>
                        <StorageWrapper>
                            {dir.map((e) => {
                                return (
                                    <div className={"directory"} onClick={() => { redirect(e) }} style={{ display: "flex", width: "15vw", height: "6vh", border: "2px solid black", margin: "20px", alignContent: "center", borderRadius: "0.5rem" }}>
                                        <div style={{ width: "18%" }}>
                                            <Image src={folder} alt="Picture of the folder" style={{ height: "100%", width: "100%" }} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexGrow: "1" }}>{e}</div>
                                    </div>
                                )
                            })}
                        </StorageWrapper>
                    </Background>
                    <DirModal open={modalOpen} onCancel={() => { setModalOpen(false) }} onCreate={createDir} />
                </>
            }
        </div>
    )
}

