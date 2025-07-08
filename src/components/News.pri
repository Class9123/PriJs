const {
  obj
} = props

<Component class="my-[7vh] flex flex-col justify-center items-center">
  <span class="max-w-[90vw] text-white text-[6vw] font-bold leading-[1.2] ">
    {
      obj.heading
    }
  </span>
  <div style="background-image:url('/static/images/newsBg.png');" class="bg-cover w-[90vw] h-[30vh] flex justify-center items-center my-[1vh]">
    <If condition="obj.redirectText && obj.redirectUrl">
    <button class="text-[3.6vw] uppercase bg-[#f88604] text-black font-extrabold rounded-full px-6 py-3 focus:outline-none focus:ring-4 focus:ring-[#f88604]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg mt-[60%]">{obj.redirectText}</button>
    </If>
  </div>
  <div class="max-w-[90vw] text-gray-500 text-[3.5vw] font-bold leading-[1.2] max-h-[10vh] overflow-y-scroll scroll-smooth pb-2">
    {obj.detail}
  </div>
</Component>