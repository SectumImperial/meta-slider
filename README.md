# meta-slider
**[DEMO-PAGE](https://sectumimperial.github.io/meta-slider/index.html)**

It's the four task of Metalamp. https://coda.io/@metalamp/education/front-end-2

## Description 
The slider can work with one or two thumbs. It can display a progress bar, display step labels on the scale, as well as a value hint above the thumb. It can take horizontal and vertical position. 
The slider can be configurated with the JS and can validdate input data. Options is object.

## How to add? 

Copy all files from the dits/slider folder and add how usually script. 
Set slider as a JQuery plugin: `$(root).sliderPlugin(options);`

## Options

| VALUE | DESCRIPTION |
|----------------|---------|
| **`min`** | Number. Sets the minimum value of the slider. Can't be more than max. |
| **`max`** | Number. Sets the maximum value of the slider. Can't be less than max. |
| **`step`** | Number. Sets the slider step value. It cannot be larger than the entire slider range. |
| **`valueFrom`** | Number. Sets the value of the first thumb. It cannot be greater than the maximum and less than the minimum value. If there is a second slider, the value of the first one cannot be greater than the value of the second one. |
| **`valueTo`** | Number. Sets the value of the second thumb. It cannot be greater than the maximum and less than the minimum value. Сannot be less than the value of the first one. It is added by setting the value `isRange: true`. |
| **`scaleMarks`** | Boolean. Adds step marks on the scale if `true`. Default `false`|
| **`scalePercentGap`** | Number. Set the gap of the scale marks. |
| **`isTip`** | Boolean. Shows the value above the thumb if `true`. Default `false`|
| **`isProgress`** | Boolean. Shows the progress bar if `true`. Default `false`|
| **`isRange`** | Boolean. Adds the second thumb if `true`. Default `false`|
| **`isVertical`** | Boolean. Sets the vertical position if `true`. Default `false`|

Example of options 
```
const options = {
  min: 0,
  max: 100,
  valueFrom: 0,
  valueTo: 0,
  step: 1,
  scalePercentGap: 5,
  scaleMarks: false,
  isTip: false,
  isProgress: false,
  isRange: false,
  isVertical: false,
};
```

## Methods

- `getState()`: return the current state.
- `setState(state)`: set new state
- `setValue(value: string, param of string: number | boolean)`: set value. Possible value for set is: `min: number`, `max: number`, `valueFrom: number`, `step: number`, `valueTo: number`, `scaleMarks: boolean`, `scalePercentGap: number`, `isTip: boolean`, `isProgress: boolean`, `isRange: boolean`, `isVertical: boolean`
- `getValue(value: string)`: return value. The possible values correspond to the options parameters.

## Commands
Clone:
`` git clone https://github.com/SectumImperial/meta-slider.git``

- `npm run start` - Command to start the dev server
- `npm run build` - Command for the project build
- `npm run lint` - Command to check syntax
- `npm run test` - Command to run tests
- `npm run transpile` - Command to transpile TS into JS. 

## Diagram 

![UML-diagram](https://github.com/SectumImperial/meta-slider/blob/master/slder.png "diagram")


