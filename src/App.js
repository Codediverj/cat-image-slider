import  { useEffect, useState, useRef } from "react";
import './App.css';


function App (){

  //Mobile 100vh error
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });

  //Slider
  function ListItem({list}) {
    return (
      <li><span><img src={list.url} alt={`Cat`+list.id} /></span></li>
    );
  }

  const ImageSlide = () => {
    const [data, setData] = useState([]);
    const dataId = useRef(0);

    const getImgID = async( ) => {
      const OPEN_API_URL = 'https://cataas.com/';
      const res =
        await fetch(`${OPEN_API_URL}api/cats`)
        .then((res)=>res.json());  
        
      const initData = res.slice(0,5).map((it)=>{
        return {
          id : dataId.current++,
          url : `${OPEN_API_URL}cat/`+it._id,
        }
      });
      setData(initData);
    };
    useEffect(()=>{
      getImgID();
    },[]);  

    const [modalOpen, setModalOpen] = useState(false);
    const [currentSlide, setcurrentSlide] = useState(0);
    const slideRef = useRef(null);
    const [buttonState1, setButtonState1] = useState(true); //prev
    const [buttonState2, setButtonState2] = useState(false); //next

    const handleImageMoveNext = () => {
      if ( currentSlide >= data.length-1 ){
        setcurrentSlide( data.length-1 );
      }else{
        setButtonState2(false);
        setcurrentSlide( currentSlide + 1 );
        setButtonState1(false);
      }
      if( currentSlide == data.length-2){
        setButtonState2(true);
      }
    }
    const handleImageMovePrev = () => {
      if ( currentSlide < 0 ){
        setcurrentSlide( 0 );
        setButtonState1(true);
      }else{
        setcurrentSlide( currentSlide - 1 );
        setButtonState2(false);
      }
      if( currentSlide == 1){
        setButtonState1(true);
      }
    }
    useEffect(() => {
      slideRef.current.style.transition = "all 0.5s ease-in-out";
      slideRef.current.style.transform = `translateX(-${currentSlide*100}vw)`;
    }, [currentSlide]);

    const handleOpenModal = (index) => {
      setModalOpen(true);
      const clickImgNum = index;
      setcurrentSlide( clickImgNum );
    }
    const handleCloseModal = () => {
      setModalOpen(false);
    }
    
    
    //ImageSlide return
    return ( 
      <div>
        <div className="imageList">
          <ul>
              {data.map((it) => {
                return (
                  <li onClick={()=> handleOpenModal(it.id)} key={it.id}><span><img src={it.url} alt={`Cat`+it.id} /></span></li>
                );
              })}
          </ul>
        </div>
        <div className={`slider_wrapper ${modalOpen ? 'open' : 'close'}`}>
          <div className="slider_box">
            <ul style={{width:`${data.length*100}`+'vw'}} ref={slideRef}>
              {data.map((it) => (
                <ListItem list={it} key={it.id}/>
              ))}
            </ul>
            <button className={`slider_btn slider_btn_prev ${buttonState1 ? 'disable' : ''}`} onClick={handleImageMovePrev}>&lt;</button>
            <button className={`slider_btn slider_btn_next ${buttonState2 ? 'disable' : ''}`} onClick={handleImageMoveNext}>&gt;</button>
            <button className={`slider_btn slider_btn_close`} onClick={handleCloseModal}>X</button>
          </div>
        </div>
      </div>
    );
  };

  //App return
  return (
    <div className="App">
      <h2>React Image Slider</h2>
      <h3>Please click any images</h3>
      <ImageSlide/>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
    </div>
  );
};
export default App;
