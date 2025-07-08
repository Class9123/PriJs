import {
  useState,
  useEffect
} from "priy";
import gsap from "gsap";

const {
  Data 
} = props

let carousel, bars;
const length = Data.length;
const time = 5000

const [index, setIndex] = useState(0);
const [obj, setObj] = useState(Data[0]);

const [touchstart, settouchstart] = useState(0);
const [touchend, settouchend] = useState(0);

let interval;

// -- Utility to restart interval
function restartInterval() {
  clearInterval(interval);
  interval = setInterval(() => switchImages(), time);
}

function switchImages(manual = false) {
  if (!carousel || !bars) return;

  let increment = 1;

  // Determine swipe direction if manual
  if (manual) {
    let deltaX = touchend() - touchstart();
    if (Math.abs(deltaX) < 40 || touchend() === 0) return; // Ignore tiny swipes

    increment = deltaX > 0 ? -1: 1;
    settouchstart(0);
    settouchend(0);
    // Reset interval after manual action
    restartInterval();
  }

  const current = index();
  let next = current + increment;

  // Wrap around
  if (next >= length) next = 0;
  if (next < 0) next = length - 1;

  // Animate image out
  gsap.to(carousel, {
    opacity: 0,
    scale: 0.95,
    duration: 0.2,
    onComplete: () => {
      setObj(Data[next]);
      gsap.fromTo(
        carousel,
        {
          opacity: 0, scale: 0.95
        },
        {
          opacity: 1, scale: 1, duration: 0.2
        }
      );
    }
  });
  const prevBar = bars.children[current]
  gsap.killTweensOf(prevBar);
  gsap.killTweensOf(prevBar.children[0]);
  prevBar.children[0].style.width = "0%";
  gsap.to(prevBar, {
    width: "6vw",
    duration: 0.5
  });

  // Animate next bar's fill
  const nextBar = bars.children[next];
  if (nextBar) {
    gsap.to(nextBar, {
      width: "13vw",
      duration: 0.5,
      onComplete: ()=> {
        gsap.to(nextBar.children[0], {
          width: "100%",
          duration: time/1000,
        });
      }
    });
  }

  setIndex(next);
}

// -- Initialize auto-switch
restartInterval();

setTimeout(() => {
  if (!bars) return;

  Data.forEach(() => {
    const outerDiv = document.createElement("div");
    const innerDiv = document.createElement("div");
    outerDiv.classList.add("bar");
    innerDiv.classList.add("bar-animate");
    outerDiv.appendChild(innerDiv);
    bars.appendChild(outerDiv);
  });

  const firstBar = bars.children[0];
  if (firstBar) {
    gsap.to(firstBar.children[0], {
      width: "100%",
      duration: time/1000
    });
  }
}, 0);

<Component>
<div $ref="carousel" class="relative min-h-[70vh] overflow-hidden" @touchstart="e => settouchstart(e.touches[0].clientX)" @touchmove="e => settouchend(e.touches[0].clientX)" @touchend="() => switchImages(true)"
  >
  <img class="w-full h-[70vh] object-cover" :src="obj().imageUrl" />
<div class="absolute bottom-[-5vh] left-0 w-full h-[50vh] bg-gradient-to-t from-black via-black/80 to-transparent z-20 pb-[10vh]"></div>
<div class="absolute bottom-[5vh] left-1/2 transform -translate-x-1/2 z-30 flex flex-col justify-center items-center">
  <div class="flex flex-wrap items-center space-x-2 text-sm text-gray-500 font-bold w-[70vw] flex justify-center mb-[1vh]">
    <span class="bg-gray-700 px-2 py-0.5 rounded skew-x-[-8deg]"> {obj().aging
    } </span>
    <span id="dubLang">Hindi</span>
    <span class="font-extrabold">|</span>
    <span>Dub</span>
    <span class="text-center"> { obj().tags.join(" , ") } </span>
  </div>
  <div class="flex flex-row justify-center items-center gap-[4vw]">

    <button id="play" type="button" class="uppercase bg-[#f88604] text-black font-extrabold rounded-full px-8 py-3 focus:outline-none focus:ring-4 focus:ring-[#f88604]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <i class="fa-solid fa-play mr-1"></i>
      start watching
    </button>

    <div class="border-2 border-[#f88604] p-[1vw] aspect-square rounded-full flex items-center justify-center">
      <i class="fa-solid fa-star text-[#f88604] text-[5vw]"></i>
    </div>
  </div>
</div>
</div>
<div class=" mt-[4vh] flex flex-row justify-center items-center gap-[3vw] mt-[5vh] mb-[6vh]" $ref="bars"
>
</div>
</Component>