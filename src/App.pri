import {
  useState
} from "priy"

const [state , setState] = useState(0)

setInterval(()=>{
  setState(prev=>prev+1)
},500)


<Component>
  {state()}
  <If condition="state()===10">
    state is equal to 10
  </If>
</Component>