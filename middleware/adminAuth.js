// const isLogin=(req,res,next)=>{
//     try {
//         console.log('chkkkkkk auth');
//         if(req.session.admin){
//             res.redirect('/admin/home')
//         }
//         next()
//     } catch (error) {
//         console.log(error);
//     }
// }

const isLogin=(req,res,next)=>{
    try {
        console.log(req.session.admin,"adminnnn");
        if(req.session.admin){
            console.log('chkk auth login')     
            next()
        }else{
        console.log('chkk auth not login')
        res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.log(error);                                 
    }
}

module.exports={
    isLogin,
    // isLogout,

}