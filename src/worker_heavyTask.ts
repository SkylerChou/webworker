/** @func 官方模擬的複雜邏輯 */
function heavyTask(): number[] {
  const randomNumber = () => Math.trunc(Math.random() * 5_000_00);
  const numbers: number[] = Array(5_000_000).fill(undefined).map(randomNumber);
  numbers.sort();
  return numbers.slice(0, 5);
}

self.onmessage = (event) => {
  console.log('模擬大量排序');
  let heavyTaskValue = heavyTask();
  self.postMessage(heavyTaskValue);
};


