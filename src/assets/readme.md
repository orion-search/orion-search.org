## Mobile asset generation

### GIFs

`ffmpeg -i search-1.mov -filter_complex "[0:v] fps=16,scale=w=640:h=-1" search.gif`
