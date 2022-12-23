# Backend API

## Login & Signup

### Signup

```
/api/user/signup
```

Input: carry `username`, `password` in body

Description: create user and make a directory for the user

### Login

```
/api/user/login
```

Input: carry `username`, `password` in body

Description: This will set up a session.

---

## Directory

### Create directory

```
/api/directory/create
```

Input: carry the direcory `path` in query

Description: Create a directory at `path`

### Get directory entries

```
/api/directory/create
```

Input: carry the directory `path` in query

Description: Retrieve directory information at `path`

---

## File

### Get file

```
/api/file
```

Input: carry the file `path` in query

Description: Retrieve file at `path`

### Upload file

```
/api/file/upload
```

Input: carry the file `path` in query; carry the file in body using multipart/form-data
