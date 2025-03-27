import { useEffect, useRef } from "react";
import "./index.css";

const LoopingElement = ({ speed, startPosition, contentArray, infScrollType }) => {
  const elementRef = useRef(null);
  const scrollTopRef = useRef(0);
  const isScrolling = useRef(true);
  const refreshRate = 100;

  const lerp = useRef({
    current: startPosition,
    target: startPosition,
    factor: 0.1,
  });

  useEffect(() => {
    const handleScroll = () => {
      const direction = window.pageYOffset || document.documentElement.scrollTop;
      if (direction > scrollTopRef.current) {
        isScrolling.current = true;
        lerp.current.target += speed * 5;
      } else {
        isScrolling.current = false;
        lerp.current.target -= speed * 5;
      }
      scrollTopRef.current = direction;
    };

    const goForward = () => {
      lerp.current.target += speed;
      if (lerp.current.target > refreshRate) {
        lerp.current.current -= refreshRate * 2;
        lerp.current.target -= refreshRate * 2;
      }
    };

    const goBackward = () => {
      lerp.current.target -= speed;
      if (lerp.current.target < -refreshRate) {
        lerp.current.current += refreshRate * 2;
        lerp.current.target += refreshRate * 2;
      }
    };

    const animate = () => {
      if (isScrolling.current) {
        goForward();
      } else {
        goBackward();
      }
      lerp.current.current =
        lerp.current.current * (1 - lerp.current.factor) + lerp.current.target * lerp.current.factor;

      if (elementRef.current) {
        elementRef.current.style.transform = `translateX(${lerp.current.current}%)`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", handleScroll);
    animate();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed]);
  
function InfScrollElements() {
    return contentArray.map((item) => {
      switch (infScrollType) {
        case "text":
          return (
            <div key={item.content} className="inf-scroll_wrapper__content-wrapper__item ">
              <span className="scrolling-text">{item.content}</span>
            </div>
          );
  
        case "image":
          return (
            <div key={item.content} className="inf-scroll_wrapper__content-wrapper__img-wrapper">
              <img src={`infscroll-images/${item.content}`} alt={item.content} />
            </div>
          );
  
        default:
          return null; // Prevents errors if infScrollType is something unexpected
      }
    });
  }
  

  return (
    <div ref={elementRef} className="inf-scroll_wrapper__content-wrapper d-flex position-absolute">
        <InfScrollElements />
    </div>
  );
};

const InfiniteScrollDa = ({ firstArray, secondArray, infScrollType }) => {
  return (
    <div className="inf-scroll__wrapper position-relative overflow-x-hidden">
      <div className="inf-scroll__wrapper__parts-wrapper d-flex">
        <LoopingElement speed={0.1} startPosition={0} contentArray={firstArray}   infScrollType={infScrollType} />
        <LoopingElement speed={0.1} startPosition={-100} contentArray={secondArray}  infScrollType={infScrollType}  />
      </div>
    </div>
  );
};

export default InfiniteScrollDa;






// https://youtu.be/qcfXA3uAD30?si=S8Y_1bfemLASctlV
