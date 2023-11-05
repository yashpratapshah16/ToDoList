
exports.getDate=function() {
  const today = new Date();
  
  const optins = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return today.toLocaleDateString("en-US", optins);
}


exports.getDay=function() {
  const today = new Date();
  const optins = {
    weekday: "long"
  };
  return today.toLocaleDateString("en-US", optins);
}