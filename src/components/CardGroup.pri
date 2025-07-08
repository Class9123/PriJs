import Card from "./Card.pri"
import gsap from "gsap";

const {
  heading,
  subheading,
  items
} = props.props

let container;

function setupCardimgObserver(container) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          gsap.to(entry.target,{
            filter:"brightness(1)",
            scale:1,
            duration:0.2
          });
        }else {
          gsap.to(entry.target,{
            filter:"brightness(0.4)",
            scale:0.96,
            duration:0.2
          });
        }
      });
    },
    {
      threshold: 0.7
    }
  );

  container.querySelectorAll(".card-img").forEach(img => {
    img.addEventListener("click", (e) => {
      if (img.style.filter.includes("brightness(1)")){
        window.location.href=e.target.dataset.redirectUrl;
        return
      }
      const sectionContainer = container;
      const scrollContainer = img.closest(".card");
      const rect = sectionContainer.getBoundingClientRect();
      const fullyVisible =
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);

      if (!fullyVisible) {
        // Scroll vertically only if not fully visible
        sectionContainer.scrollIntoView({
          behavior: "smooth", block: "center"
        });

        // Wait for the scroll to finish
        setTimeout(() => {
          centerImageInCard(img, scrollContainer);
        }, 100); // Adjust as needed
      } else {
        // Already visible, just center the image
        centerImageInCard(img, scrollContainer);
      }
    });

    function centerImageInCard(img,
      scrollContainer) {
      const scrollOffset =
      img.offsetLeft - (scrollContainer.offsetWidth / 2) + (img.offsetWidth / 2);
      scrollContainer.scrollTo({
        left: scrollOffset,
        behavior: "smooth"
      });
    }
    observer.observe(img);
  });
  return container;
}

setTimeout(() => {
  setupCardimgObserver(container)
}, 0)

<Component class="px-[5vw] cardMain">
  <h2 class="heading">
    {
      heading
    }
  </h2>

  <p class="subheading">
    {
      subheading
    }
  </p>

  <Repeat $ref="container" for="item in items" class="card no-scrollbar">
    <Card :props="item" />
  </Repeat>
</Component>