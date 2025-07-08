import { useState } from "priy";
import CardGroup from "../components/CardGroup.pri";
import News from "../components/News.pri";
const { FullData } = props

<Component class="my-5">
  <Repeat for="obj in FullData">
    <If condition="obj.type==='card'">
      <CardGroup :props="obj"/>
    </If>
    <If condition="obj.type==='news'">
      <News :obj="obj"/>
    </If>
  </Repeat>
</Component>