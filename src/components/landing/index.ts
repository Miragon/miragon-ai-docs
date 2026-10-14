// The components website MDX may use, by the name the page writes
// (<PageSection>, <CardGrid> ...). The route templates pass this map to
// <Content components={WEBSITE_COMPONENTS} />, the way the VitePress theme
// registered them globally. Islands go through an .astro wrapper: MDX in a
// collection cannot set client:* on a component it does not import.
import BrandContactIsland from "./BrandContactIsland.astro"
import CardGrid from "./CardGrid.astro"
import CompareCards from "./CompareCards.astro"
import CtaBox from "./CtaBox.astro"
import FeatureList from "./FeatureList.astro"
import HandOver from "./HandOver.astro"
import LifecycleMapIsland from "./LifecycleMapIsland.astro"
import Note from "./Note.astro"
import PageSection from "./PageSection.astro"
import PhaseTools from "./PhaseTools.astro"
import PillButton from "./PillButton.astro"
import StepList from "./StepList.astro"
import TryItOut from "./TryItOut.astro"

export const WEBSITE_COMPONENTS = {
  PageSection,
  CardGrid,
  FeatureList,
  StepList,
  CompareCards,
  PillButton,
  CtaBox,
  Note,
  PhaseTools,
  HandOver,
  TryItOut,
  BrandContact: BrandContactIsland,
  LifecycleMap: LifecycleMapIsland,
}
