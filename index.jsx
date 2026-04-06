import { useState, useRef, useEffect, useCallback, useReducer } from "react";

// ─── SPRITESHEET TILES (sliced from uploaded spritesheet) ─────────────────
const SHEET_TILES = [
  {id:"ss_road_h",label:"Road H",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABGUlEQVR4nO2YsQkCMRhGE+/Kw3hgI7iGtbUT2AqO4ByO4BwO4RqCjXieXHvEwjoRJOQh+V77B/6XR6rY3Xbtu8GbEH3fB2e/cD4uovPN4ZZ0n3MuOGsba+pu8ObxCgfonmNSoW/cE+8bbfhuxhgzSbrtD1EAWoBGAWgBGgWgBWgUgBagUQBagEYBaAEaBaAFaBSAFqBRAFqARgFoAZriA9S5F67219wroxT/AhSAFqBRAFqARgFoARoFoAVoFIAWoFEAWoBGAWgBmuz/AZfTMjrP/V9Q/AtQAFqARgFoARoFoAVoFIAWoFEAWoBGAWgBGgWgBWgUgBagUQBagEYBaAGa4gPUbWOjBypfZVL5MJ+l3eem4fu1jTVv9/we8lJ4I+gAAAAASUVORK5CYII=",code:"ROAD_H",color:"#1e1e1e",isSprite:true},
  {id:"ss_road_v",label:"Road V",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABCklEQVR4nO2YvQ2CUBgAP35KNIawhwtYOAojMBI7OIALWFg4hoWJlhisNUFDw6nctfDgcgHy8ZLTYdd3UcQQTdMMHvt1ymUaeRdFdLEYPOl8uU+oND0pLUBjAFqAxgC0AI0BaAEaA9ACNLMPkGw36/7fx90hqlXmE2AAWoAmOR72/bvf4bqup7OZGL8B4StgAAPQAjQGoAVoDEAL0BiAFqBxP4CWoDEALUDjfgAtQWMAWoDGALQAjQFoARoD0AI0BqAFaNwPoCVoDEAL0LgfQEvQGIAWoDEALUBjAFqA5uMc8MrrXNC27agbftN654DwFTCAAWgBmtkHyPO4jVpQrbLnC8T1Z9eXyzQeeCE9dHUrAHUAAAAASUVORK5CYII=",code:"ROAD_V",color:"#1e1e1e",isSprite:true},
  {id:"ss_pavement",label:"Pavement",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABAklEQVR4nO2aMQqDQBBFxygYLAJ7Ba/gOWxyjLQ5+AYha5rEdIKK7bxi/qvcbfb5WGzG6vm4L1OpLArjOK7PbT1bM5XKXu8LqOTL59tt1nHe/ITwAZr9xjAMrgI55806peR6fvgboAC0AI0C0AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AM1hNrif1XnjfX74G6AAtADN4RvgPZ/X/wEwCkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AM1hLtD3PeGBEf4GhA/Q3LrFzH7rxrUunI0zbT3bHxB1HT082byfAAAAAElFTkSuQmCC",code:"PAVEMENT",color:"#888",isSprite:true},
  {id:"ss_brick_wall",label:"Brick Wall",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABHklEQVR4nO2bQQqCQBhGxxDdtBIxT9FB2nYkT9FhOkC1q0sU1C7IcGG7YHQV6jzj/96qaTOPx480g0XHatM2tTPDdrf/fi6yxMVN7VzzAo0Cc72/vfUC8pgN5gPE3S9Ol0NQgfNt6a3Xq2fQ/c1PgALQAjQKQAvQKAAtQKMAtACNAtACNL2zQPe3eWim3//hrcxPgALQAjS9Z8Cv53H6PD90f/MToAC0AI0C0AI0CkAL0CgALUCjALQAzej3AfO/T9B9gIcC0AI0g+8DhkLfJ5ifAAWgBWgUgBagUQBagEYBaAEaBaAFaPR+wMS7zR4FoAVo9H7AmDL/iALQAjQKQAvQKAAtQBOVedp2/05qhTJPNQHmA8RFltAOGEWWuA9u6jl7TfGfVAAAAABJRU5ErkJggg==",code:"BRICK_WALL",color:"#8b2a2a",isSprite:true},
  {id:"ss_blue_wall",label:"Blue Wall",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABLklEQVR4nO2bsQ2CUBRFwRCobAghTGDpEhZO4RQu4Ap2LmFr4QBWdhb0FsYQQ2IpDdZIgsUP//zw7+nQwD25eaC+xHC5mLdV3QQ+kqdxEFV1EzxfH9oFY0YL0HhfQPT7wuZ4HzzheiuNAt/n/eD7q+1h1Pxyt+4cez8BKoAWoOk9A0zvMVNs53s/ASqAFqDpPQP+fU6Pje187ydABdACNCqAFqBRAbQATe97wNi/x+l9wONy6hx7PwEqgBag0T7AapqDqABagEb7AKtpDqICaAEaFUAL0KgAWoBG+wCjq00AFUAL0GgfYDXNQVQALUCjfYDVNAdRAbQAjQqgBWhUAC1Ao32A0dUmgAqgBWi0D7Ca5iAqgBagCYssaX3962yRJZoA7wuI8jSmHTDyNA6+zw5gsG1YsfAAAAAASUVORK5CYII=",code:"BLUE_WALL",color:"#1a3a8a",isSprite:true},
  {id:"ss_grey_floor",label:"Grey Floor",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABO0lEQVR4nO2awQqCQBRFLcRFUqgLP8BF4Ka/8dvduQ4JXeeiWjtBw2B6hHfPLqU6XO6bxqHD7Xp+98MUWaQskijuhym6P560C8aRFqAxH0DsXmiahvBAyNKXGqAAaAGarzVgb3Rdt+j9VVX9vG++AQqAFqDxrgFLZ9CHb0ZdxnH8eT/P86DPM98ABUAL0ATvA0JnzMU3w1tjvgEKgBagUQC0AI0CoAVodn8e4LJ0H+JivgEKgBagwdeAtm1nr90ZDz0vCMV8AxQALUATvAbs7Xl+KeYboABoARrvGrD277C7D9ga8w1QALQAjQKgBWgUAC1As/qzwL/P8P6N+QYoAFqABj8TrOsa/X7zDVAAtACNAqAFaBQALUCz+f8E94b5BigAWoBGAdACNOYDiMsimV3I0heksj2X0zv6AN+cJ8YsYqy9AAAAAElFTkSuQmCC",code:"GREY_FLOOR",color:"#555",isSprite:true},
  {id:"ss_shop_front",label:"Shop Front",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABUElEQVR4nO2aP2oCQRhHR1kVYiyisuwt9AR2IRewTZFDiJ3YiofwBDlBbhBSRFLYp5KQNK5bhMHVLpBiZwp1Hzq/VwnfuvN4fODfyuuwv7dpbopYNr8KZ8YY8zTuO+eL2btz3sti5/yc59/c1kxk09zYza7woiy3zgN8ZKn7+XZbfHYZ51ePuvsVoAC0AI0C0AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNMEHqCTdxn79/Ut7ICTdhjZAAWgBGgWgBWgUgBagiSaDu38/IY9efkCd8zO/7/w9brZq2gAFoAVoIt8Fj8+fJz3w7WN10vv5WE0fnPPgN0ABaAEaBaAFaBSAFqDxvg8o+3W7bILfAAWgBWgUgBagUQBagEYBaAEaBaAFaLyfBXzfqV06wW+AAtACNPqPEC1BE3yAKG7XaQeMuF03B/NyPqnxeQX1AAAAAElFTkSuQmCC",code:"SHOP_FRONT",color:"#c8860a",isSprite:true},
  {id:"ss_fence_gate",label:"Fence Gate",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABZklEQVR4nO2asUrDUBhG/2pCxiSQocVB0N3Brn0EF1dfx3dxdfERXHVwV3CpCsGk4FKK1E1JhFwuNB7h/87U0DscDn9uL+VOFvODbd1uzCNVkVpStxt7e/cZwMxsjxagUQBagEYBaAEa9wGSdrWyplnTHgjZfqYJUABagCYp8tzWnz9H4aZpQJ3xKcvy+3ORp5oABaAFaJLQgpezRed5fv80mswuuDs96jzPbm4H17ufAAWgBWiCe0Cfq8MyvGiAi+fuOePx+qTzfHz+MPh9iPbyI2q9+wlQAFqAJnoP6L/DY9PfE0L0zwEh3E+AAtACNKOfA/56z4jF/QQoAC1Ag58DYn/nd437CVAAWoBGAWgBGgWgBWiC54DQ/+r/jdlyGbXe/QQoAC1AM5lW2fa19nlHaFrpjpACuA/w646QJ3RHyPQKKIAC0AI0CkAL0CgALUCjALQAjQLQAjTuAyRVkdIOGFWR2hf6Mz0j1R5X3QAAAABJRU5ErkJggg==",code:"FENCE_GATE",color:"#cc4400",isSprite:true},
  {id:"ss_car_red",label:"Red Car",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABWklEQVR4nO2asU7DQBAFL5ZrS3aJC9pIuKGGIjWigZIPTJvPyA8YBCUNNBCj9CTU5yJm5UWDtG+6U5LzaHS6yPYt7m8uj7v9IUWkqYpU7vaH9PH1TbtgFLQAjQLQAjQKQAvQhA9QWn/Q9/1feLjRdZ3p++FXgALQAjTmPaCu65OfP11dZOOXz8F6iZPcPb+5zhd+BSgALUBj3gOsPCzOnWfUHuCKAtACNOY9YBjy//X322s3md+wWZ5l49X2MRu3bWuaL/wKUABagEYBaAEaBaAFaGbfC0zd76+T7/MAb8KvAAWgBWgUgBagUQBagMb9maD/M8Cc9fHVdb7wK0ABaAEaBaAFaBSAFqCZfT5g/L5+s5wnNMX4elPnFaYIvwIUgBagUQBagEYBaAGa2ecDxqy27HsAnQ8wogC0AI15D7Cex//vhF8BCkAL0CgALUATPkDZVHEbNFWRfgCIPy+H4mnMVwAAAABJRU5ErkJggg==",code:"CAR_RED",color:"#cc0000",isSprite:true},
  {id:"ss_car_white",label:"White Car",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABd0lEQVR4nO2asU7DMBRF0yhzpHjNwJAJkYURsbBVQkyMiI/pN/ANfAILGxsDaxBT/qByUHcKczwYWU50QO+ezXptfHX06iaON7fX59/+cCws4uqyqPzhWOw/v+gsGCUdgEYC6AA0EkAHoDEvoEr9wjAM0frLxVm0fvX6Hq2f7p6j9Y/dNlrv+z5aDzHfARJAB6BJXgOapsma0HsfrV8+vK06f4j5DpAAOgBN8hrwG3ebk/gHbu6XnjIL8x0gAXQAmuQ1YJqm2Tj8X+9X/o2P4zgbO+dm47Ztk65nvgMkgA5As/h9wPD0uPQlV8V8B0gAHYAmew1I3YP7a5jvAAmgA9BIAB2ARgLoADTZ9wHhu8K19wPCZ41wPyAV8x0gAXQAGgmgA9BIAB2AJvt8QNd1s3G4b7804Xy55wXMd4AE0AFoJIAOQCMBdACa7PMBIbnP57nofEAiEkAHoEleA/77u8AQ8x0gAXQAGgmgA9CYF1C52q4DV5fFDyeJM9vgaEVUAAAAAElFTkSuQmCC",code:"CAR_WHITE",color:"#ddd",isSprite:true},
  {id:"ss_traffic_cone",label:"Traffic Cone",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABPUlEQVR4nO2asQnCQBhGo4QT4iguoJ0bOIG4RsDKLpWNtlZOIDiAhaALOIqC12hhZZSkuLu84v9eJ2J8PH6Ty5nebrt8PbzLLFI4n+UP77K7H9AuGH1agEYBaAEaBaAFaBSAFqBRAFqARgFoARoFoAVozAfIU39BWZZBn6+qKpLJf8xPgALQAjTJzwF1TpNR4/vTy60jkw/mJ0ABaAEaBaAFaBSAFqDpfB3Q9XW+DfMToAC0AE30c8DifPx6HbYb8LufEHt/wPwEKAAtQJN8HdB2/99G6nWD+QlQAFqARgFoARoFoAVoepv16hXyqGzof3+hhNwbDN1TE6AAtABN8L1A/Tc4PuxDD9nIdTaPejzzE6AAtACNAtACNApAC9BE3xOMfZ1OjfkJUABagEYBaAEa8wHywnnaAaNwPnsDTRYrFEVSvaYAAAAASUVORK5CYII=",code:"TRAFFIC_CONE",color:"#ff6600",isSprite:true},
  {id:"ss_window",label:"Window",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABCElEQVR4nO2YvQ3CMBQGDbKM5P0yiwsW8AC0TOBZvEK2IIUbqJMCCT2LA73vukj5OZ1erDin++363EYKHslphLiNFB7jQrtgnGkBGgWgBWgUgBagUQBagEYBaAEaBaAFaBSAFqBxHyBab9B7/+j8dV2tj9yxLIvpevcToAC0AI15DZj9Tn8b9xOgALQAzfTvgFLK2/Ota0ZrbXes7wAjCkAL0CgALUCjALQAjQLQAjQKQAvQmPcCR/7t/4D7CVAAWoBGAWgBGgWgBWgUgBagUQBagGb6XuD43/7XcT8BCkAL0JjXgFrrDA8M9xOgALQAjQLQAjQKQAvQKAAtQOM+QMxp0A4YOY3wAjsfJG7UUvfSAAAAAElFTkSuQmCC",code:"WINDOW",color:"#4488cc",isSprite:true},
  {id:"ss_grass_tile",label:"Grass",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABIklEQVR4nO2bMQ6CMBhGS2FhJfEOLg4y62TiLbyJl/IATu46uHgHwlwWwV2lpJHwgv3eWvvn5aUDhZjsj2VXN63pI9+uete+4S537/qv80L3+yhsa7K6aU3lPAGeadBQ55k1xrzQ/UPYUafNEAWgBWgUgBagUQBagEYBaAGa6AMkm9Ohq0Z+vJwLi/SpE6AAtABNNvSD9dJ//749/Pf/qeeF7o/+BCgALUCjALQAjQLQAjS6C9ASNApAC9AoAC1AowC0AI0C0AI0CkAL0Hy8E3Tna9CAfFd616eeN7T/nehPgALQAjQKQAvQKAAtQKMAtACNAtACNPouQEvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AE30AbLC+v/t/c8UtjUvbYw/ldDkXtQAAAAASUVORK5CYII=",code:"GRASS_TILE",color:"#2a6a1a",isSprite:true},
  {id:"ss_person_green",label:"Person",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABUUlEQVR4nO2aMUvDQBxHL5csgiAEipurXQzobHFw7+AqBfd+Hnc/gSDODuKukC7t6laEQEFwyqWLQy6DIU3KQ+73tj+F6+P1kpZLo+nzbVU4a0Iktc4khbPmq4xpF4wwP/oawQdIhl5wdfMw9JIep493g64X/A5QAFqApvM9YN/XeN/373qPCH4HKAAtQNP7d8DJPPPmg+sLbz4fn3Va72O5+PP1n5d3b/68zzut3yT4HaAAtACNAtACNApAC9AMfh7QpO17nSb4HaAAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQATXT5NKv6/E2u+ayujau3jTdnx9/enK8Pvfl1crSb2C/NZ5V1RnGpHaAAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0PQ+D/jP6DzA6BJQAAWgBWiCD5Ck1tEOGKl1Zgs6hDK5WititAAAAABJRU5ErkJggg==",code:"PERSON",color:"#228822",isSprite:true},
  {id:"ss_bars",label:"Bars",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA4ElEQVR4nO3QMQ6CABAF0RUpkRjiQTkKd/Ealh7DwkRLjNZ0UD01f7ot/mYyu+vl/J6rq7WM47i4p2lavf22/dA31c7V1VyH1Q9u99fi3rL9xn2zaf2HJIAW0CSAFtAkgBbQJIAW0CSAFtAkgBbQJIAW0CSAFtAkgBbQJIAW0CSAFtAkgBbQJIAW0CSAFtAkgBbQJIAW0CSAFtAkgBbQJIAW0CSAFtAkgBbQJIAW0CSAFtAkgBbQJIAW0CSAFtAkgBbQJIAW0CSAFtAkgBbQtG09Nw1Ox/3yQT1+dj/0TX0ATTcke+X78MgAAAAASUVORK5CYII=",code:"BARS",color:"#888",isSprite:true},
  {id:"ss_lamp_post",label:"Lamp Post",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABNElEQVR4nO2bsQ2CQBhG0ZAz0jGNC1C4ACswhNQ6gRWJE7CAK7iJhQmVGK/R2kLN+SPPeN/rCDnu+fJzFU522/rWe5f8KuvNxrS+Xq2e3sucT9Leu+TsZ6ZNvsnxdDWtf/fbpqan/wHRB0jH3rBtW9P6y2H58v58sQ96XvQToAC0AM3oZ4CV0Hf8HdFPgALQAjT4GZDn+cN1URQP12VZfnX/6CdAAWgBGgWgBWgUgBagUQBagEYBaAEaBaAFaBSAFqBRAFqARgFoARoFoAVoFIAWoFEAWoBGAWgBGgWgBWgUgBagUQBagEYBaAEaBaAFaBSAFqAZ/DvB0P8DdF0XtH7o7wajnwAFoAVozGdA0zRDeHy8X1VVpudFPwEKQAvQmM8A6ztIE/0ERB8gzZynHTAy55M7b/spw+lXYMoAAAAASUVORK5CYII=",code:"LAMP_POST",color:"#aaa",isSprite:true}
];

// ─── SVG TILE RENDERER ────────────────────────────────────────────────────
function TileSVG({ id, size = 36 }) {
  const s = size;
  const svgs = {
    grass: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a4a1a"/><rect x={0} y={22} width={36} height={14} fill="#2d6e2d"/><rect x={2} y={18} width={3} height={8} fill="#3a8a2a" rx={1}/><rect x={8} y={15} width={3} height={11} fill="#44a030" rx={1}/><rect x={14} y={17} width={3} height={9} fill="#3a8a2a" rx={1}/><rect x={20} y={14} width={3} height={12} fill="#50b83c" rx={1}/><rect x={27} y={16} width={3} height={10} fill="#3a8a2a" rx={1}/><rect x={31} y={18} width={3} height={8} fill="#44a030" rx={1}/></svg>,
    dirt: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#5c3d1a"/><rect x={3} y={5} width={6} height={4} fill="#6e4a22" rx={1}/><rect x={15} y={10} width={8} height={3} fill="#4a2e10" rx={1}/><rect x={25} y={6} width={5} height={5} fill="#6e4a22" rx={1}/><rect x={8} y={20} width={7} height={4} fill="#4a2e10" rx={1}/><rect x={22} y={22} width={9} height={3} fill="#6e4a22" rx={1}/><circle cx={6} cy={28} r={3} fill="#4a2e10"/><circle cx={20} cy={14} r={2} fill="#7a5530"/></svg>,
    rock: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#2a2a2a"/><polygon points="6,30 2,30 8,8 14,6 20,10 18,30" fill="#3d3d3d"/><polygon points="18,30 16,12 24,6 32,10 34,30" fill="#4a4a4a"/><polygon points="6,30 18,30 16,12 8,8" fill="#333"/><line x1={10} y1={15} x2={8} y2={25} stroke="#555" strokeWidth={1}/><line x1={22} y1={12} x2={20} y2={22} stroke="#555" strokeWidth={1}/></svg>,
    mountain: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a1a2a"/><polygon points="18,2 2,34 34,34" fill="#3d3d4d"/><polygon points="18,2 10,20 26,20" fill="#d8e8f0"/><polygon points="26,8 14,34 36,34" fill="#4a4a5a"/><polygon points="26,8 20,20 32,20" fill="#e0eef8"/></svg>,
    ocean: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#0a1e40"/><path d="M 0 14 Q 9 10 18 14 Q 27 18 36 14" stroke="#1a4a8a" strokeWidth={2} fill="none"/><path d="M 0 22 Q 9 18 18 22 Q 27 26 36 22" stroke="#1a4a8a" strokeWidth={2} fill="none"/><path d="M 0 30 Q 9 26 18 30 Q 27 34 36 30" stroke="#1a4a8a" strokeWidth={1.5} fill="none"/></svg>,
    lava: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#3a0800"/><path d="M 0 18 Q 9 12 18 18 Q 27 24 36 18" stroke="#ff6600" strokeWidth={3} fill="none"/><path d="M 0 26 Q 9 20 18 26 Q 27 32 36 26" stroke="#ff4400" strokeWidth={3} fill="none"/><circle cx={8} cy={10} r={3} fill="#ff8800"/><circle cx={22} cy={14} r={4} fill="#ff6600"/></svg>,
    pine: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#0a1a0a"/><rect x={16} y={26} width={4} height={10} fill="#5c3a1a"/><polygon points="18,2 6,18 30,18" fill="#1a5a1a"/><polygon points="18,8 8,22 28,22" fill="#228822"/><polygon points="18,14 9,26 27,26" fill="#2aaa2a"/></svg>,
    wall: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#3a2e20"/><rect x={0} y={0} width={18} height={9} fill="#5a4830" rx={1}/><rect x={18} y={0} width={18} height={9} fill="#4a3820" rx={1}/><rect x={0} y={9} width={9} height={9} fill="#4a3820" rx={1}/><rect x={9} y={9} width={18} height={9} fill="#5a4830" rx={1}/><rect x={27} y={9} width={9} height={9} fill="#4a3820" rx={1}/><rect x={0} y={18} width={18} height={9} fill="#5a4830" rx={1}/><rect x={18} y={18} width={18} height={9} fill="#4a3820" rx={1}/><rect x={0} y={27} width={9} height={9} fill="#4a3820" rx={1}/><rect x={9} y={27} width={18} height={9} fill="#5a4830" rx={1}/><rect x={27} y={27} width={9} height={9} fill="#4a3820" rx={1}/></svg>,
    castle: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a1a2a"/><rect x={4} y={16} width={28} height={20} fill="#3a3a4a"/><rect x={4} y={10} width={6} height={8} fill="#3a3a4a"/><rect x={14} y={10} width={8} height={8} fill="#3a3a4a"/><rect x={26} y={10} width={6} height={8} fill="#3a3a4a"/><rect x={4} y={8} width={6} height={4} fill="#4a4a5a"/><rect x={26} y={8} width={6} height={4} fill="#4a4a5a"/><rect x={14} y={6} width={8} height={6} fill="#4a4a5a"/><rect x={15} y={22} width={6} height={14} fill="#2a2a3a"/></svg>,
    spawn: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a1a00"/><circle cx={18} cy={18} r={14} fill="#2a2a00" stroke="#aaaa00" strokeWidth={1.5}/><polygon points="18,6 21,16 32,16 23,22 26,32 18,26 10,32 13,22 4,16 15,16" fill="#ffff00" opacity={0.9}/></svg>,
    portal: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#0a0018"/><ellipse cx={18} cy={18} rx={13} ry={14} fill="#1a0030"/><ellipse cx={18} cy={18} rx={13} ry={14} fill="none" stroke="#aa44ff" strokeWidth={2}/><ellipse cx={18} cy={18} rx={9} ry={10} fill="none" stroke="#cc66ff" strokeWidth={1.5}/><circle cx={18} cy={18} r={3} fill="#ffffff" opacity={0.8}/></svg>,
    chest: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a1000"/><rect x={4} y={16} width={28} height={18} fill="#8b5a10" rx={2}/><rect x={4} y={14} width={28} height={6} fill="#aa7020" rx={2}/><rect x={4} y={14} width={28} height={3} fill="#cc8830"/><circle cx={18} cy={24} r={2} fill="#ffcc00"/></svg>,
    enemy: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a0000"/><rect x={8} y={10} width={20} height={16} fill="#cc0000" rx={3}/><rect x={6} y={6} width={5} height={6} fill="#cc0000"/><rect x={25} y={6} width={5} height={6} fill="#cc0000"/><circle cx={13} cy={17} r={3} fill="white"/><circle cx={23} cy={17} r={3} fill="white"/><circle cx={14} cy={17} r={1.5} fill="#330000"/><circle cx={24} cy={17} r={1.5} fill="#330000"/></svg>,
    torch: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#100800"/><rect x={15} y={18} width={6} height={18} fill="#8b5a1a"/><ellipse cx={18} cy={12} rx={5} ry={7} fill="#ff8800" opacity={0.9}/><ellipse cx={18} cy={10} rx={3} ry={5} fill="#ffcc00" opacity={0.8}/></svg>,
    npc: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#001800"/><circle cx={18} cy={11} r={7} fill="#dda060"/><rect x={10} y={18} width={16} height={18} fill="#224488" rx={3}/><rect x={6} y={18} width={6} height={14} fill="#224488" rx={3}/><rect x={24} y={18} width={6} height={14} fill="#224488" rx={3}/><polygon points="12,4 18,2 24,4 22,8 18,7 14,8" fill="#886622"/></svg>,
  };
  return svgs[id] || <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a1a2a" rx={3}/><text x={18} y={23} textAnchor="middle" fontSize={18} fill="#555">?</text></svg>;
}

// ─── TILE CATEGORIES ──────────────────────────────────────────────────────
const SVG_TILES_CATS = {
  "Nature":     [{id:"grass",label:"Grass",color:"#1a3a1a",code:"GRASS"},{id:"dirt",label:"Dirt",color:"#3b2614",code:"DIRT"},{id:"rock",label:"Rock",color:"#2e2e2e",code:"ROCK"},{id:"mountain",label:"Mountain",color:"#3a3a3a",code:"MOUNTAIN"},{id:"ocean",label:"Ocean",color:"#0a2040",code:"OCEAN"},{id:"lava",label:"Lava",color:"#4a1400",code:"LAVA"}],
  "Flora":      [{id:"pine",label:"Pine",color:"#0f2e0f",code:"TREE_PINE"}],
  "Structures": [{id:"wall",label:"Wall",color:"#2e2416",code:"WALL"},{id:"castle",label:"Castle",color:"#2e2a20",code:"CASTLE"}],
  "Game Logic": [{id:"spawn",label:"Spawn",color:"#2a2600",code:"SPAWN_POINT"},{id:"portal",label:"Portal",color:"#1a0a2a",code:"PORTAL"},{id:"chest",label:"Chest",color:"#2e2010",code:"CHEST"},{id:"enemy",label:"Enemy",color:"#2a0a00",code:"ENEMY_SPAWN"},{id:"npc",label:"NPC",color:"#0a1a0a",code:"NPC_SPAWN"}],
  "Environment":[{id:"torch",label:"Torch",color:"#2a1800",code:"TORCH"}],
};

const ALL_SVG_TILES = Object.values(SVG_TILES_CATS).flat();

const TILE_SIZE = 40;
const MIN_ZOOM = 0.15, MAX_ZOOM = 4;
const LAYER_COLORS = ["#3d8a4a","#8a4a9a","#4a6a9a","#9a8a20","#9a4a40","#3a8a8a"];

const DEFAULT_LAYERS = [
  {id:"ground",    name:"Ground",    visible:true, locked:false, opacity:1,   color:"#3d8a4a"},
  {id:"objects",   name:"Objects",   visible:true, locked:false, opacity:1,   color:"#8a4a9a"},
  {id:"logic",     name:"Game Logic",visible:true, locked:false, opacity:0.9, color:"#9a8a20"},
];

// ─── REDUCER ──────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "PAINT": {
      const {layerId,x,y,tileId,rotation} = action;
      const key = `${x},${y}`;
      const lyr = {...(state.layers[layerId]||{})};
      if (tileId===null) delete lyr[key];
      else lyr[key] = {tile:tileId, rot:rotation||0};
      return {...state, layers:{...state.layers,[layerId]:lyr}};
    }
    case "SET_ROT": {
      // update rotation of existing tile at x,y on active layer
      const {layerId,x,y,rot} = action;
      const key = `${x},${y}`;
      const lyr = {...(state.layers[layerId]||{})};
      if (lyr[key]) lyr[key] = {...lyr[key], rot};
      return {...state, layers:{...state.layers,[layerId]:lyr}};
    }
    case "ADD_LAYER": {
      const id=`lyr_${Date.now()}`;
      return {...state, layerDefs:[...state.layerDefs,{id,name:action.name,visible:true,locked:false,opacity:1,color:action.color}], layers:{...state.layers,[id]:{}}};
    }
    case "REMOVE_LAYER": {
      const layerDefs=state.layerDefs.filter(l=>l.id!==action.id);
      const layers={...state.layers}; delete layers[action.id];
      return {...state,layerDefs,layers};
    }
    case "TOGGLE_VISIBLE": return {...state,layerDefs:state.layerDefs.map(l=>l.id===action.id?{...l,visible:!l.visible}:l)};
    case "TOGGLE_LOCK":    return {...state,layerDefs:state.layerDefs.map(l=>l.id===action.id?{...l,locked:!l.locked}:l)};
    case "SET_OPACITY":    return {...state,layerDefs:state.layerDefs.map(l=>l.id===action.id?{...l,opacity:action.val}:l)};
    case "REORDER": {
      const defs=[...state.layerDefs]; const [m]=defs.splice(action.from,1); defs.splice(action.to,0,m);
      return {...state,layerDefs:defs};
    }
    case "CLEAR_LAYER": return {...state,layers:{...state.layers,[action.id]:{}}};
    case "SET_GRID":    return {...state,gridW:action.w,gridH:action.h};
    case "ADD_CUSTOM":  return {...state,customTiles:[...state.customTiles,action.tile]};
    case "DEL_CUSTOM":  return {...state,customTiles:state.customTiles.filter(t=>t.id!==action.id)};
    case "PUSH_HISTORY":return {...state,history:[...state.history.slice(-39),action.snap]};
    case "UNDO":        return state.history.length?{...state,layers:state.history[state.history.length-1],history:state.history.slice(0,-1)}:state;
    default: return state;
  }
}

function initState() {
  const layers={}; DEFAULT_LAYERS.forEach(l=>{layers[l.id]={};});
  return {layerDefs:DEFAULT_LAYERS,layers,gridW:36,gridH:24,customTiles:[],history:[]};
}

// ─── CODE GEN ─────────────────────────────────────────────────────────────
function genCode(state, worldName, lang, allTiles) {
  const find = id=>allTiles.find(t=>t.id===id)||{code:id.toUpperCase()};
  const total = Object.values(state.layers).reduce((s,l)=>s+Object.keys(l).length,0);
  const wName = worldName.replace(/\s+/g,"_");

  if (lang==="json") {
    return JSON.stringify({world:worldName,grid:{w:state.gridW,h:state.gridH},
      layers:state.layerDefs.map(layer=>({
        id:layer.id,name:layer.name,opacity:layer.opacity??1,visible:layer.visible,
        tiles:Object.entries(state.layers[layer.id]||{}).map(([k,v])=>{
          const [x,y]=k.split(",").map(Number);
          return {x,y,tile:find(v.tile||v).code,rotation:v.rot||0};
        }),
      }))},null,2);
  }
  if (lang==="py") {
    const L=[`# World: ${worldName}  ${state.gridW}x${state.gridH}  Objects:${total}`,``,`class World_${wName}:`,`    def build(self):`];
    state.layerDefs.forEach(layer=>{
      const objs=Object.entries(state.layers[layer.id]||{});
      if(!objs.length) return;
      L.push(`        # ${layer.name}`);
      objs.forEach(([k,v])=>{const[x,y]=k.split(",").map(Number);const tid=v.tile||v;const rot=v.rot||0;L.push(`        self.place("${find(tid).code}",${x},${y},rotation=${rot})`);});
      L.push(``);
    });
    return L.join("\n");
  }
  const L=[`// World: ${worldName}  ${state.gridW}x${state.gridH}  Objects:${total}`,``,`class World_${wName} {`,`  static meta={name:"${worldName}",gridW:${state.gridW},gridH:${state.gridH}};`,``,`  build(engine){`];
  state.layerDefs.forEach(layer=>{
    const objs=Object.entries(state.layers[layer.id]||{});
    if(!objs.length) return;
    L.push(`    // ${layer.name}`);
    L.push(`    const ${layer.id}=engine.createLayer("${layer.name}",{opacity:${layer.opacity??1}});`);
    objs.forEach(([k,v])=>{const[x,y]=k.split(",").map(Number);const tid=v.tile||v;const rot=v.rot||0;L.push(`    ${layer.id}.place("${find(tid).code}",${x},${y},{rotation:${rot}});`);});
    L.push(``);
  });
  L.push(`  }`); L.push(`}`);
  return L.join("\n");
}

function hlColor(line,lang) {
  if(/^(#|\/\/)/.test(line.trim())) return "#6e7681";
  if(/\b(class|def|const|let|static)\b/.test(line)) return "#ff7b72";
  if(/\.(place|createLayer)\(/.test(line)) return "#79c0ff";
  if(/"[^"]+"/.test(line)) return "#a5d6ff";
  return "#e6edf3";
}

// ─── MAIN ─────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch]       = useReducer(reducer,null,initState);
  const [activeLayer,setAL]     = useState("ground");
  const [activeTile,setAT]      = useState("grass");
  const [activeRot,setRot]      = useState(0);   // 0,90,180,270
  const [tool,setTool]          = useState("paint");
  const [zoom,setZoom]          = useState(1);
  const [pan,setPan]            = useState({x:20,y:20});
  const [isPainting,setIP]      = useState(false);
  const [isPanning,setIPan]     = useState(false);
  const [panStart,setPanStart]  = useState(null);
  const [worldName,setWN]       = useState("MyWorld");
  const [leftTab,setLT]         = useState("tiles");
  const [sheetTab,setST]        = useState("spritesheet"); // "spritesheet" | "svgtiles"
  const [codelang,setCL]        = useState("js");
  const [copied,setCopied]      = useState(false);
  const [search,setSearch]      = useState("");
  const [svgCat,setSvgCat]      = useState("Nature");
  const [showAddLayer,setSAL]   = useState(false);
  const [newLayerName,setNLN]   = useState("");
  const [showCustom,setSC]      = useState(false);
  const [cIcon,setCIcon]        = useState("🎯");
  const [cLabel,setCLabel]      = useState("");
  const [cCode,setCCode]        = useState("");
  const [gridWI,setGW]          = useState(36);
  const [gridHI,setGH]          = useState(24);
  const [hovered,setHovered]    = useState(null);
  const [showCode,setShowCode]  = useState(true);
  const [selCell,setSelCell]    = useState(null); // for rotate existing tile
  const canvasRef = useRef(null);
  const lastCell  = useRef(null);

  const allSpriteTiles = [...SHEET_TILES, ...state.customTiles.filter(t=>t.isSprite)];
  const allSvgTiles    = [...ALL_SVG_TILES, ...state.customTiles.filter(t=>!t.isSprite)];
  const allTiles       = [...SHEET_TILES, ...ALL_SVG_TILES, ...state.customTiles];

  const tilesInView = search
    ? allTiles.filter(t=>t.label.toLowerCase().includes(search.toLowerCase()))
    : sheetTab==="spritesheet" ? allSpriteTiles : (SVG_TILES_CATS[svgCat]||[]);

  const getCell = useCallback((cx,cy)=>{
    const rect=canvasRef.current?.getBoundingClientRect();
    if(!rect) return null;
    return {x:Math.floor((cx-rect.left-pan.x)/(zoom*TILE_SIZE)),y:Math.floor((cy-rect.top-pan.y)/(zoom*TILE_SIZE))};
  },[pan,zoom]);

  const doPaint = useCallback((x,y)=>{
    const key=`${x},${y}`;
    if(lastCell.current===key) return;
    lastCell.current=key;
    const layer=state.layerDefs.find(l=>l.id===activeLayer);
    if(!layer||layer.locked) return;
    dispatch({type:"PUSH_HISTORY",snap:{...state.layers}});
    dispatch({type:"PAINT",layerId:activeLayer,x,y,tileId:tool==="erase"?null:activeTile,rotation:activeRot});
  },[activeLayer,activeTile,activeRot,tool,state.layerDefs,state.layers]);

  const onMouseDown=useCallback((e)=>{
    if(e.button===1||e.altKey){e.preventDefault();setIPan(true);setPanStart({x:e.clientX-pan.x,y:e.clientY-pan.y});return;}
    if(e.button!==0) return;
    if(tool==="select"){
      const c=getCell(e.clientX,e.clientY);
      setSelCell(c);
      return;
    }
    setIP(true); lastCell.current=null;
    const c=getCell(e.clientX,e.clientY);
    if(c) doPaint(c.x,c.y);
  },[pan,getCell,doPaint,tool]);

  const onMouseMove=useCallback((e)=>{
    if(isPanning&&panStart){setPan({x:e.clientX-panStart.x,y:e.clientY-panStart.y});return;}
    const c=getCell(e.clientX,e.clientY);
    setHovered(c);
    if(isPainting&&c) doPaint(c.x,c.y);
  },[isPanning,panStart,isPainting,getCell,doPaint]);

  const onMouseUp=useCallback(()=>{setIP(false);setIPan(false);setPanStart(null);lastCell.current=null;},[]);

  const onWheel=useCallback((e)=>{
    e.preventDefault();
    const rect=canvasRef.current?.getBoundingClientRect();
    const mx=e.clientX-rect.left,my=e.clientY-rect.top;
    const nz=Math.min(MAX_ZOOM,Math.max(MIN_ZOOM,zoom*(e.deltaY<0?1.15:0.87)));
    const sc=nz/zoom;
    setPan(p=>({x:mx-sc*(mx-p.x),y:my-sc*(my-p.y)}));
    setZoom(nz);
  },[zoom]);

  useEffect(()=>{
    const el=canvasRef.current; if(!el) return;
    el.addEventListener("wheel",onWheel,{passive:false});
    return()=>el.removeEventListener("wheel",onWheel);
  },[onWheel]);

  useEffect(()=>{
    const h=(e)=>{
      if((e.ctrlKey||e.metaKey)&&e.key==="z") dispatch({type:"UNDO"});
      if(e.key==="r"||e.key==="R") setRot(r=>(r+90)%360);
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[]);

  // rotate a selected existing tile
  const rotateSelected = useCallback((dir)=>{
    if(!selCell) return;
    const key=`${selCell.x},${selCell.y}`;
    const lyr=state.layers[activeLayer]||{};
    const entry=lyr[key];
    if(!entry) return;
    const cur=entry.rot||0;
    const newRot=(cur+(dir>0?90:-90)+360)%360;
    dispatch({type:"SET_ROT",layerId:activeLayer,x:selCell.x,y:selCell.y,rot:newRot});
  },[selCell,activeLayer,state.layers]);

  const totalObjects=Object.values(state.layers).reduce((s,l)=>s+Object.keys(l).length,0);
  const activeLayerDef=state.layerDefs.find(l=>l.id===activeLayer);
  const layerColor=activeLayerDef?.color||"#388bfd";
  const code=genCode(state,worldName,codelang,allTiles);

  // build render list
  const renderTiles=[];
  state.layerDefs.forEach(layer=>{
    if(!layer.visible) return;
    Object.entries(state.layers[layer.id]||{}).forEach(([key,v])=>{
      const [x,y]=key.split(",").map(Number);
      const tileId=v.tile||v; const rot=v.rot||0;
      const tile=allTiles.find(t=>t.id===tileId);
      if(tile) renderTiles.push({x,y,tile,rot,layer,uid:`${layer.id}_${key}`});
    });
  });

  const inp={background:"#0d1117",border:"1px solid #30363d",borderRadius:5,color:"#e6edf3",padding:"5px 8px",fontFamily:"inherit",fontSize:11,outline:"none",boxSizing:"border-box",width:"100%"};
  const smBtn=(bg,col)=>({background:bg||"#161b22",border:"none",borderRadius:4,color:col||"#8b949e",padding:"4px 8px",cursor:"pointer",fontSize:10,fontFamily:"inherit"});

  // selected cell info
  const selEntry = selCell ? (state.layers[activeLayer]||{})[`${selCell.x},${selCell.y}`] : null;

  return (
    <div style={{height:"100vh",background:"#060a0f",color:"#c9d1d9",fontFamily:"'JetBrains Mono','Fira Code','Courier New',monospace",display:"flex",flexDirection:"column",overflow:"hidden",userSelect:"none"}}>

      {/* ═══ TOP BAR ═══ */}
      <div style={{height:44,background:"#0d1117",borderBottom:"1px solid #21262d",display:"flex",alignItems:"center",padding:"0 12px",gap:8,flexShrink:0}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:"#388bfd",boxShadow:"0 0 8px #388bfd"}}/>
        <span style={{color:"#e6edf3",fontWeight:700,fontSize:13,letterSpacing:1}}>GAMEFORGE</span>
        <div style={{width:1,height:18,background:"#21262d"}}/>
        <input value={worldName} onChange={e=>setWN(e.target.value)} style={{...inp,width:140,padding:"3px 8px",fontSize:12}}/>
        <div style={{width:1,height:18,background:"#21262d"}}/>

        {/* Tools */}
        {[{id:"paint",icon:"✏",l:"Paint"},{id:"erase",icon:"◻",l:"Erase"},{id:"select",icon:"⬡",l:"Select"}].map(t=>(
          <button key={t.id} onClick={()=>setTool(t.id)}
            style={{background:tool===t.id?"#161b22":"transparent",border:`1px solid ${tool===t.id?(t.id==="erase"?"#f78166":t.id==="select"?"#ffa657":"#388bfd"):"transparent"}`,borderRadius:5,color:tool===t.id?(t.id==="erase"?"#f78166":t.id==="select"?"#ffa657":"#58a6ff"):"#6e7681",padding:"4px 10px",cursor:"pointer",fontSize:11,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
            {t.icon} {t.l}
          </button>
        ))}

        {/* Rotation control */}
        <div style={{display:"flex",alignItems:"center",gap:4,background:"#161b22",border:"1px solid #30363d",borderRadius:5,padding:"3px 8px"}}>
          <span style={{fontSize:10,color:"#6e7681"}}>Rotate</span>
          <button onClick={()=>setRot(r=>(r+270)%360)} style={{...smBtn(),"border":"1px solid #30363d",borderRadius:3,padding:"1px 6px"}}>↺</button>
          <span style={{fontSize:11,color:"#ffa657",minWidth:28,textAlign:"center",fontWeight:700}}>{activeRot}°</span>
          <button onClick={()=>setRot(r=>(r+90)%360)} style={{...smBtn(),"border":"1px solid #30363d",borderRadius:3,padding:"1px 6px"}}>↻</button>
          <span style={{fontSize:9,color:"#3d444d"}}>(R)</span>
        </div>

        <button onClick={()=>dispatch({type:"UNDO"})} style={{background:"transparent",border:"1px solid transparent",borderRadius:5,color:"#6e7681",padding:"4px 10px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>↩ Undo</button>

        <div style={{flex:1}}/>
        <span style={{fontSize:10,color:"#3d444d"}}>{Math.round(zoom*100)}%</span>
        <button onClick={()=>{setZoom(1);setPan({x:20,y:20});}} style={{background:"transparent",border:"1px solid #30363d",borderRadius:4,color:"#6e7681",padding:"3px 9px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>Reset</button>
        <button onClick={()=>setShowCode(s=>!s)} style={{background:showCode?"#161b22":"transparent",border:`1px solid ${showCode?"#388bfd":"#30363d"}`,borderRadius:4,color:showCode?"#58a6ff":"#6e7681",padding:"3px 10px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>{"{ }"} Code</button>
      </div>

      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* ═══ LEFT SIDEBAR ═══ */}
        <div style={{width:230,background:"#0d1117",borderRight:"1px solid #21262d",display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>

          {/* Tabs */}
          <div style={{display:"flex",background:"#080c10",borderBottom:"1px solid #21262d",flexShrink:0}}>
            {[["tiles","Tiles"],["layers","Layers"],["world","World"]].map(([id,lb])=>(
              <button key={id} onClick={()=>setLT(id)}
                style={{flex:1,background:"transparent",border:"none",borderBottom:`2px solid ${leftTab===id?"#388bfd":"transparent"}`,color:leftTab===id?"#58a6ff":"#6e7681",padding:"8px 0 6px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>
                {lb}
              </button>
            ))}
          </div>

          {/* ── TILES TAB ── */}
          {leftTab==="tiles" && (
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{padding:"7px 8px 4px",flexShrink:0}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search all tiles…" style={inp}/>
              </div>

              {/* Sheet toggle */}
              {!search && (
                <div style={{display:"flex",borderBottom:"1px solid #21262d",flexShrink:0}}>
                  <button onClick={()=>setST("spritesheet")} style={{flex:1,background:sheetTab==="spritesheet"?"#161b22":"transparent",border:"none",borderBottom:`2px solid ${sheetTab==="spritesheet"?"#ffa657":"transparent"}`,color:sheetTab==="spritesheet"?"#ffa657":"#6e7681",padding:"6px 0",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>
                    📸 Spritesheet
                  </button>
                  <button onClick={()=>setST("svg")} style={{flex:1,background:sheetTab==="svg"?"#161b22":"transparent",border:"none",borderBottom:`2px solid ${sheetTab==="svg"?"#58a6ff":"transparent"}`,color:sheetTab==="svg"?"#58a6ff":"#6e7681",padding:"6px 0",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>
                    🎨 SVG Tiles
                  </button>
                </div>
              )}

              {/* SVG category chips */}
              {!search && sheetTab==="svg" && (
                <div style={{display:"flex",flexWrap:"wrap",gap:3,padding:"5px 8px 4px",borderBottom:"1px solid #21262d",flexShrink:0}}>
                  {Object.keys(SVG_TILES_CATS).map(cat=>(
                    <button key={cat} onClick={()=>setSvgCat(cat)}
                      style={{background:svgCat===cat?"#161b22":"transparent",border:`1px solid ${svgCat===cat?"#388bfd":"#21262d"}`,borderRadius:4,color:svgCat===cat?"#58a6ff":"#6e7681",padding:"2px 7px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Tile grid */}
              <div style={{flex:1,overflowY:"auto",padding:"7px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,alignContent:"start"}}>
                {tilesInView.map(tile=>{
                  const isActive=activeTile===tile.id;
                  return (
                    <button key={tile.id} title={tile.label}
                      onClick={()=>{setAT(tile.id);setTool("paint");}}
                      style={{background:isActive?"#1c2128":"#0d1117",border:`2px solid ${isActive?layerColor:"#21262d"}`,borderRadius:8,padding:"5px 3px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,boxShadow:isActive?`0 0 10px ${layerColor}44`:"none",transition:"border-color 0.1s"}}>
                      {tile.isSprite
                        ? <img src={tile.src} width={44} height={44} style={{imageRendering:"pixelated",borderRadius:3}} alt={tile.label}/>
                        : <TileSVG id={tile.id} size={44}/>}
                      <span style={{fontSize:8,color:isActive?"#e6edf3":"#8b949e",textAlign:"center",lineHeight:1.2,overflow:"hidden",width:"100%",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tile.label}</span>
                    </button>
                  );
                })}
                {/* custom tiles */}
                {!search && state.customTiles.map(tile=>{
                  const isActive=activeTile===tile.id;
                  return(
                    <button key={tile.id} title={tile.label}
                      onClick={()=>{setAT(tile.id);setTool("paint");}}
                      style={{background:isActive?"#1c2128":"#0d1117",border:`2px solid ${isActive?"#f78166":"#30363d"}`,borderRadius:8,padding:"5px 3px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,position:"relative"}}>
                      <div style={{width:44,height:44,background:"#1a1a2a",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{tile.icon||"?"}</div>
                      <span style={{fontSize:8,color:"#f78166",textAlign:"center"}}>{tile.label}</span>
                      <span onMouseDown={e=>{e.stopPropagation();dispatch({type:"DEL_CUSTOM",id:tile.id});}} style={{position:"absolute",top:3,right:5,fontSize:10,color:"#6e7681",cursor:"pointer",fontWeight:"bold"}}>×</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom tile adder */}
              <div style={{borderTop:"1px solid #21262d",padding:"7px 8px",flexShrink:0}}>
                {!showCustom
                  ? <button onClick={()=>setSC(true)} style={{width:"100%",background:"transparent",border:"1px dashed #30363d",borderRadius:6,color:"#6e7681",padding:"6px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>+ Custom Tile</button>
                  : <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      <div style={{display:"flex",gap:5}}>
                        <input value={cIcon} onChange={e=>setCIcon(e.target.value)} style={{...inp,width:34,padding:"3px 2px",fontSize:18,textAlign:"center"}}/>
                        <input value={cLabel} onChange={e=>setCLabel(e.target.value)} placeholder="Label" style={{...inp,flex:1,width:"auto"}}/>
                      </div>
                      <input value={cCode} onChange={e=>setCCode(e.target.value)} placeholder="CODE_NAME" style={inp}/>
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>{if(!cLabel.trim()||!cCode.trim()) return;dispatch({type:"ADD_CUSTOM",tile:{id:`c_${Date.now()}`,icon:cIcon,label:cLabel.trim(),code:cCode.trim().toUpperCase(),color:"#2a1a2a",isSprite:false}});setCIcon("🎯");setCLabel("");setCCode("");setSC(false);}} style={{flex:1,background:"#196c2e",border:"none",borderRadius:4,color:"#3fb950",padding:"5px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✓ Add</button>
                        <button onClick={()=>setSC(false)} style={{...smBtn("#161b22","#6e7681"),padding:"5px 9px"}}>✕</button>
                      </div>
                    </div>
                }
              </div>
            </div>
          )}

          {/* ── LAYERS TAB ── */}
          {leftTab==="layers" && (
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
                {[...state.layerDefs].reverse().map((layer,ri)=>{
                  const realIdx=state.layerDefs.length-1-ri;
                  const isActive=activeLayer===layer.id;
                  return (
                    <div key={layer.id}
                      onClick={()=>setAL(layer.id)}
                      style={{background:isActive?"#161b22":"#0d1117",border:`1.5px solid ${isActive?layer.color:"#21262d"}`,borderRadius:8,padding:"10px",marginBottom:6,cursor:"pointer",boxShadow:isActive?`0 0 12px ${layer.color}33`:"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:12,height:12,borderRadius:3,background:layer.visible?layer.color:"#3d444d",flexShrink:0,boxShadow:layer.visible?`0 0 6px ${layer.color}88`:"none"}}/>
                        <span style={{flex:1,fontSize:12,fontWeight:isActive?600:400,color:isActive?"#e6edf3":"#8b949e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{layer.name}</span>
                        <span style={{fontSize:10,color:"#3d444d",background:"#161b22",padding:"1px 5px",borderRadius:3}}>{Object.keys(state.layers[layer.id]||{}).length}</span>
                      </div>
                      {isActive && (
                        <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:7}} onClick={e=>e.stopPropagation()}>
                          <div style={{display:"flex",gap:5}}>
                            <button onClick={()=>dispatch({type:"TOGGLE_VISIBLE",id:layer.id})} style={{flex:1,background:layer.visible?"#0f2a1a":"#1c2128",border:`1px solid ${layer.visible?"#2ea043":"#30363d"}`,borderRadius:4,color:layer.visible?"#3fb950":"#6e7681",padding:"4px 2px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>{layer.visible?"👁 Visible":"🙈 Hidden"}</button>
                            <button onClick={()=>dispatch({type:"TOGGLE_LOCK",id:layer.id})} style={{flex:1,background:layer.locked?"#2a1010":"#1c2128",border:`1px solid ${layer.locked?"#f78166":"#30363d"}`,borderRadius:4,color:layer.locked?"#f78166":"#6e7681",padding:"4px 2px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>{layer.locked?"🔒 Locked":"🔓 Free"}</button>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{fontSize:9,color:"#3d444d",flexShrink:0}}>Opacity</span>
                            <input type="range" min={0} max={1} step={0.05} value={layer.opacity??1} onChange={e=>dispatch({type:"SET_OPACITY",id:layer.id,val:+e.target.value})} style={{flex:1,accentColor:layer.color}}/>
                            <span style={{fontSize:10,color:"#8b949e",width:30,textAlign:"right"}}>{Math.round((layer.opacity??1)*100)}%</span>
                          </div>
                          <div style={{display:"flex",gap:4}}>
                            <button onClick={()=>dispatch({type:"REORDER",from:realIdx,to:Math.max(0,realIdx-1)})} style={smBtn()}>↑</button>
                            <button onClick={()=>dispatch({type:"REORDER",from:realIdx,to:Math.min(state.layerDefs.length-1,realIdx+1)})} style={smBtn()}>↓</button>
                            <button onClick={()=>{if(window.confirm(`Clear "${layer.name}"?`))dispatch({type:"CLEAR_LAYER",id:layer.id});}} style={{...smBtn(),flex:1}}>Clear</button>
                            {state.layerDefs.length>1&&<button onClick={()=>{if(window.confirm(`Delete "${layer.name}"?`)){dispatch({type:"REMOVE_LAYER",id:layer.id});setAL(state.layerDefs.find(l=>l.id!==layer.id)?.id||"");}}} style={{...smBtn("#3d1a1a","#f78166"),border:"1px solid #f78166"}}>🗑</button>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{padding:"8px",borderTop:"1px solid #21262d",flexShrink:0}}>
                {!showAddLayer
                  ? <button onClick={()=>setSAL(true)} style={{width:"100%",background:"transparent",border:"1px dashed #30363d",borderRadius:6,color:"#6e7681",padding:"7px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>+ Add Layer</button>
                  : <div style={{display:"flex",gap:5}}>
                      <input value={newLayerName} onChange={e=>setNLN(e.target.value)} placeholder="Layer name" autoFocus style={{...inp,flex:1,width:"auto"}}/>
                      <button onClick={()=>{if(!newLayerName.trim()) return;dispatch({type:"ADD_LAYER",name:newLayerName.trim(),color:LAYER_COLORS[state.layerDefs.length%LAYER_COLORS.length]});setNLN("");setSAL(false);}} style={{background:"#196c2e",border:"none",borderRadius:4,color:"#3fb950",padding:"5px 9px",cursor:"pointer",fontFamily:"inherit",fontSize:12}}>✓</button>
                      <button onClick={()=>setSAL(false)} style={{...smBtn("#161b22","#6e7681"),padding:"5px 9px"}}>✕</button>
                    </div>
                }
              </div>
            </div>
          )}

          {/* ── WORLD TAB ── */}
          {leftTab==="world" && (
            <div style={{flex:1,overflowY:"auto",padding:"12px 10px"}}>
              <div style={{fontSize:10,color:"#3d444d",letterSpacing:2,marginBottom:8}}>GRID SIZE</div>
              <div style={{display:"flex",gap:6,marginBottom:7}}>
                {[["W",gridWI,setGW],["H",gridHI,setGH]].map(([l,v,s])=>(
                  <div key={l} style={{flex:1}}>
                    <div style={{fontSize:10,color:"#6e7681",marginBottom:3}}>{l}</div>
                    <input type="number" value={v} min={4} max={999} onChange={e=>s(+e.target.value)} style={{...inp,fontSize:12}}/>
                  </div>
                ))}
              </div>
              <button onClick={()=>dispatch({type:"SET_GRID",w:gridWI,h:gridHI})} style={{width:"100%",background:"#1f6feb",border:"none",borderRadius:5,color:"white",padding:"7px",cursor:"pointer",fontSize:12,fontFamily:"inherit",marginBottom:18}}>Apply {gridWI}×{gridHI}</button>
              <div style={{fontSize:10,color:"#3d444d",letterSpacing:2,marginBottom:8}}>STATS</div>
              {[["Grid",`${state.gridW}×${state.gridH}`],["Layers",state.layerDefs.length],["Objects",totalObjects],["Custom",state.customTiles.length]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #21262d",fontSize:12}}>
                  <span style={{color:"#6e7681"}}>{k}</span><span style={{color:"#e6edf3",fontWeight:600}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:18,fontSize:10,color:"#3d444d",letterSpacing:2,marginBottom:8}}>CONTROLS</div>
              {[["✏️ Left drag","Paint"],["⬡ Select","Rotate existing"],["🖱 Middle/Alt","Pan"],["⚙ Scroll","Zoom"],["R key","Rotate brush"],["Ctrl+Z","Undo"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:11}}>
                  <span style={{color:"#8b949e"}}>{k}</span><span style={{color:"#6e7681"}}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═══ CANVAS ═══ */}
        <div ref={canvasRef}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          style={{flex:1,overflow:"hidden",position:"relative",cursor:isPanning?"grabbing":tool==="erase"?"cell":tool==="select"?"default":"crosshair",background:"#060a0f"}}>

          {/* Active layer badge */}
          <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:"#0d1117dd",border:`1px solid ${layerColor}`,borderRadius:20,padding:"4px 14px",fontSize:11,zIndex:10,display:"flex",alignItems:"center",gap:7,backdropFilter:"blur(8px)"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:layerColor,boxShadow:`0 0 8px ${layerColor}`}}/>
            <span style={{color:layerColor,fontWeight:600}}>{activeLayerDef?.name||"?"}</span>
            <span style={{color:"#3d444d"}}>·</span>
            <span style={{color:"#6e7681"}}>{tool}</span>
            {tool==="paint" && <span style={{color:"#ffa657"}}>{activeRot}°</span>}
          </div>

          {/* Select panel: rotate existing */}
          {tool==="select" && selCell && (
            <div style={{position:"absolute",top:46,left:"50%",transform:"translateX(-50%)",background:"#0d1117",border:"1px solid #30363d",borderRadius:8,padding:"8px 14px",fontSize:11,zIndex:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:"#6e7681"}}>Cell [{selCell.x},{selCell.y}]</span>
              {selEntry ? <>
                <span style={{color:"#ffa657"}}>rot: {selEntry.rot||0}°</span>
                <button onClick={()=>rotateSelected(-1)} style={{...smBtn("#161b22","#ffa657"),border:"1px solid #ffa65755",borderRadius:4,padding:"3px 8px",fontSize:12}}>↺ -90°</button>
                <button onClick={()=>rotateSelected(1)}  style={{...smBtn("#161b22","#ffa657"),border:"1px solid #ffa65755",borderRadius:4,padding:"3px 8px",fontSize:12}}>↻ +90°</button>
              </> : <span style={{color:"#3d444d"}}>no tile here</span>}
            </div>
          )}

          {/* World viewport */}
          <div style={{position:"absolute",left:pan.x,top:pan.y}}>
            {/* Grid */}
            <svg style={{position:"absolute",top:0,left:0,pointerEvents:"none"}} width={state.gridW*TILE_SIZE*zoom} height={state.gridH*TILE_SIZE*zoom}>
              <defs><pattern id="g" width={TILE_SIZE*zoom} height={TILE_SIZE*zoom} patternUnits="userSpaceOnUse"><path d={`M${TILE_SIZE*zoom} 0L0 0 0 ${TILE_SIZE*zoom}`} fill="none" stroke="#141c24" strokeWidth={zoom>1.5?0.8:0.5}/></pattern></defs>
              <rect width="100%" height="100%" fill="#060a0f"/>
              <rect width="100%" height="100%" fill="url(#g)"/>
              <rect width="100%" height="100%" fill="none" stroke={layerColor} strokeWidth={2} opacity={0.3}/>
            </svg>

            {/* Tiles */}
            {renderTiles.map(({x,y,tile,rot,layer,uid})=>(
              <div key={uid} style={{position:"absolute",left:x*TILE_SIZE*zoom,top:y*TILE_SIZE*zoom,width:TILE_SIZE*zoom,height:TILE_SIZE*zoom,opacity:layer.opacity??1,pointerEvents:"none",overflow:"hidden",boxSizing:"border-box"}}>
                <div style={{width:TILE_SIZE,height:TILE_SIZE,transform:`scale(${zoom}) rotate(${rot}deg)`,transformOrigin:"center center",position:"absolute",left:0,top:0}}>
                  {tile.isSprite
                    ? <img src={tile.src} width={TILE_SIZE} height={TILE_SIZE} style={{imageRendering:"pixelated",display:"block"}} alt=""/>
                    : <TileSVG id={tile.id} size={TILE_SIZE}/>}
                </div>
              </div>
            ))}

            {/* Selected cell highlight */}
            {tool==="select" && selCell && selCell.x>=0 && selCell.x<state.gridW && selCell.y>=0 && selCell.y<state.gridH && (
              <div style={{position:"absolute",left:selCell.x*TILE_SIZE*zoom,top:selCell.y*TILE_SIZE*zoom,width:TILE_SIZE*zoom,height:TILE_SIZE*zoom,border:`2px solid #ffa657`,boxShadow:"0 0 10px #ffa65766",pointerEvents:"none",boxSizing:"border-box"}}/>
            )}

            {/* Hover preview */}
            {tool!=="select" && hovered && hovered.x>=0 && hovered.x<state.gridW && hovered.y>=0 && hovered.y<state.gridH && (
              <div style={{position:"absolute",left:hovered.x*TILE_SIZE*zoom,top:hovered.y*TILE_SIZE*zoom,width:TILE_SIZE*zoom,height:TILE_SIZE*zoom,border:`${Math.max(1.5,zoom)}px solid ${tool==="erase"?"#f78166":layerColor}`,background:tool==="erase"?"rgba(247,129,102,0.1)":"rgba(56,139,253,0.07)",pointerEvents:"none",boxSizing:"border-box",overflow:"hidden"}}>
                {tool==="paint" && (() => {
                  const t=allTiles.find(t=>t.id===activeTile);
                  if(!t) return null;
                  return (
                    <div style={{width:TILE_SIZE,height:TILE_SIZE,transform:`scale(${zoom}) rotate(${activeRot}deg)`,transformOrigin:"center center",opacity:0.6,position:"absolute",left:0,top:0}}>
                      {t.isSprite
                        ? <img src={t.src} width={TILE_SIZE} height={TILE_SIZE} style={{imageRendering:"pixelated",display:"block"}} alt=""/>
                        : <TileSVG id={t.id} size={TILE_SIZE}/>}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Status bar */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:26,background:"rgba(6,10,15,0.92)",borderTop:"1px solid #21262d",display:"flex",alignItems:"center",gap:18,padding:"0 14px",fontSize:11}}>
            <span style={{color:"#3d444d"}}>Grid <span style={{color:"#6e7681"}}>{state.gridW}×{state.gridH}</span></span>
            {hovered&&<span style={{color:"#3d444d"}}>Cell <span style={{color:"#58a6ff"}}>[{hovered.x},{hovered.y}]</span></span>}
            {(() => { const t=allTiles.find(t=>t.id===activeTile); return t?<span style={{color:"#3d444d"}}>Tile <span style={{color:"#e6edf3"}}>{t.label}</span></span>:null; })()}
            <span style={{marginLeft:"auto",color:"#3d444d"}}>Objects <span style={{color:"#3fb950",fontWeight:700}}>{totalObjects}</span></span>
          </div>
        </div>

        {/* ═══ CODE PANEL ═══ */}
        {showCode && (
          <div style={{width:270,borderLeft:"1px solid #21262d",background:"#0d1117",display:"flex",flexDirection:"column",flexShrink:0}}>
            <div style={{padding:"8px 10px",borderBottom:"1px solid #21262d",display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
              <span style={{fontSize:11,color:"#58a6ff",flex:1,fontWeight:600}}>Generated Code</span>
              {["js","py","json"].map(l=>(
                <button key={l} onClick={()=>setCL(l)} style={{background:codelang===l?"#161b22":"transparent",border:`1px solid ${codelang===l?"#388bfd":"#21262d"}`,borderRadius:3,color:codelang===l?"#58a6ff":"#6e7681",padding:"2px 7px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>{l}</button>
              ))}
              <button onClick={()=>{navigator.clipboard.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{background:copied?"#0f2a1a":"#161b22",border:`1px solid ${copied?"#2ea043":"#30363d"}`,borderRadius:3,color:copied?"#3fb950":"#6e7681",padding:"2px 8px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>{copied?"✓":"Copy"}</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"10px 12px"}}>
              <pre style={{margin:0,fontSize:11,lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-all"}}>
                {code.split("\n").map((line,i)=>(
                  <div key={i} style={{display:"flex",gap:10}}>
                    <span style={{color:"#3d444d",minWidth:18,textAlign:"right",flexShrink:0,fontSize:9,paddingTop:2}}>{i+1}</span>
                    <span style={{color:hlColor(line,codelang)}}>{line||" "}</span>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
