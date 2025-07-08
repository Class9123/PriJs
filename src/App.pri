import Header from "./views/Header.pri";
import Caurosel from "./views/Caurosel.pri";
import Main from "./views/Main.pri";
import {
  WholeData,
  CaursoelData
} from "./hooks/store.js";

import "./input.css";

<Component class=" root ">
  <Header />
  <Caurosel :Data="CaursoelData.items" />
  <Main :FullData = " WholeData "/>

</Component>