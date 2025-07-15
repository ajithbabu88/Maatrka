
export const disclaimerYellow = "This information is shared for general insight. Please adapt gently.";
export const advisoryOrange = "Because this can carry risk, consider guidance from a qualified teacher.";
export const refusalRed = "I'm sorry — I can’t help with that.";

export function applyTemplate(zone: string, answer: string){
  if(zone==='Red') return refusalRed;
  if(zone==='Orange') return advisoryOrange + "\n\n" + answer;
  if(zone==='Yellow') return disclaimerYellow + "\n\n" + answer;
  return answer;
}
