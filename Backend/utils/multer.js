import multer from "multer";


export const validationObject = {
    image:['image/png','image/jpeg'],
    file:['application/pdf']
}

export const myMulterCloud = ({customValidtion="image/png"}={})=>{
    
    const storage = multer.diskStorage({})
    const fileFilter = (req,file,cb)=>{
        if(customValidtion.includes(file.mimetype)){
            return cb(null,true)
        }
        cb('invalid EXE',false)
    }
     const upload = multer({fileFilter,storage})
     return upload
}