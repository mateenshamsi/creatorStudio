import cloudinary from 'cloudinary' 
export const uploadImage = async(file:File,folder:string)=>{ 
    const buffer = await file.arrayBuffer() 
    const bytes =  Buffer.from(buffer)

    return  new Promise(async(resolve,reject)=>{ 
       await cloudinary.uploader.upload_stream({
            resource_type:'auto' ,
            folder:folder 
        },async(err,res)=>{ 
            if(err) { 
                reject(err.message) 
            }
            resolve(res) 
        }).end(bytes) 
    })

} 