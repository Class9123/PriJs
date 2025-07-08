const {
  props: obj
} = props

<Component class="crad no-scrollbar">
  <div class="card-img-wrap">
    <img class="card-img" :src="obj.imgUrl" />
  <span class="name">{obj.name}</span>
  <span class="name-more">{obj.aging} Hindi</span>
</div>
</Component>