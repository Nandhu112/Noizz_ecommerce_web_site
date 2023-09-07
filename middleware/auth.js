const userHelpers = require("../helpers/userHelpers")

const isLogin=(req,res,next)=>{
    try {

        // console.log('chkkkkkk auth');
        if(req.session.user){
            // console.log('chkkkkkk auth inside if');
            res.redirect('/home')
        }
        else{
            // console.log('chkkkkkk auth inside else');
            next()
        }
    } catch (error) {
        console.log(error);
    }
}
const isBlocked=(async(req,res,next)  =>{
    // console.log(req.session.user1._id,'chkkk usr session')
    try {
    const u1= await userHelpers.getUserById (req.session.user1._id)
    // console.log(u1.,'chkk usr  details')
    // console.log(u1.  Blocked,'chkkk u1');      
    const check= u1.Blocked    
    // console.log(u1,"blockcheck");
    if(check){
        // console.log('blkdddddddd')
        res.send('BLOCKED')            
    }
    else{
        // console.log('not blkdddddddd')     
        next()
    }
    } catch (error) {
        console.log(error);
    }
})
const isLogout=(req,res,next)=>{
    try {
        // console.log(req.session.user,'chk session');
        if(!req.session.user){
            res.redirect('/login')
        }else{
            
            next()
        }
    } catch (error) {
        console.log(error);
    }
}
         
module.exports={
    isLogin,
    isLogout,
    isBlocked
}