const allLikeBtn = document.querySelectorAll('.like-btn');


async function likeBtn(productid,btn){

    try{
        await axios({
            method: 'post',
            url: `/products/${productid}/like`,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
       
        if(btn.children[0].classList.contains('fas')){
            btn.children[0].classList.remove('fas');
            btn.children[0].classList.add('far');
        }
        else{
            btn.children[0].classList.remove('far');
            btn.children[0].classList.add('fas');
        }



    }
    catch(e){
        window.location.replace('/login');
        console.log(e.message);
    }


}


for(let btn of allLikeBtn){
    btn.addEventListener('click', () => {
        const productid = btn.getAttribute('product-id');
        likeBtn(productid,btn);
    });
}