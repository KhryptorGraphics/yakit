const {httpApi} = require("../httpServer")
const {ipcMain} = require("electron")
const fs = require("fs")
const FormData = require("form-data")

module.exports = (win, getClient) => {
    ipcMain.handle("upload-img", async (event, params) => {
        const {path, type} = params
        // 创建数据流
        // console.log('time1',new Date().getHours(),new Date().getMinutes(),new Date().getSeconds());
        const readerStream = fs.createReadStream(path)// 可以像使用同步接口一样使用它。
        const formData = new FormData()
        formData.append("file_name", readerStream)
        formData.append("type", type)
        const res=httpApi(
            "post",
            "upload/img",
            formData,
            {"Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`},
            false
        )
        // res.then(()=>{
        //     console.log('time3',new Date().getHours(),new Date().getMinutes(),new Date().getSeconds());
        // })
        return res
    })

    ipcMain.handle("upload-project", async (event, params) => {
        const {path} = params
        // 创建数据流
        const readerStream = fs.createReadStream(path)// 可以像使用同步接口一样使用它。
        const formData = new FormData()
        formData.append("projectFile", readerStream)
        const res=httpApi(
            "post",
            "import/project",
            formData,
            {"Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`},
            false
        )
        return res
    })

    ipcMain.handle("yak-install-package", async (event, params) => {
        const {path} = params
        // 创建数据流
        const readerStream = fs.createReadStream(path)// 可以像使用同步接口一样使用它。
        readerStream.on('data', (chunk) => {
            // 处理读取的分片数据
            console.log('Received a chunk of data:');
            console.log(chunk.toString());
          });
          
          readerStream.on('end', () => {
            // 读取完成的回调
            console.log('File reading completed.');
          });
          
          readerStream.on('error', (error) => {
            // 读取过程中出错的回调
            console.error('An error occurred while reading the file.');
            console.error(error);
          });
        // const formData = new FormData()
        // formData.append("installPackage", readerStream)
        // const res=httpApi(
        //     "post",
        //     "yak/install/package",
        //     formData,
        //     {"Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`},
        //     false,
        //     30*60*1000
        // )
        // return res
    })

    ipcMain.handle("get-folder-under-files", async (event, params) => {
        const {folderPath} = params
        if (!folderPath) return 0
        fs.readdir(folderPath, (err, files) => {
            if (err) throw err
            event.sender.send(`send-folder-under-files`, files)
        })
    })
}
