const { useState, useEffect } = React;

enum Act{
  EAT="EAT",
  PLAY="PLAY",
  SLEEP="SLEEP"
}

enum PetMood{ 
  HAPPY, 
  EXCITED,
  CONTENT, 
  SAD,
  TIRED,
  SICK,
  HUNGRY
}

const emoji: Record<PetMood, string> = {
[PetMood.HAPPY]:"😀",
[PetMood.EXCITED]:"🤪",
[PetMood.CONTENT]:"😁",
[PetMood.SAD]:"😭",
[PetMood.TIRED]:"😴",
[PetMood.SICK]:"🤧",
[PetMood.HUNGRY]:"🤤"
}

const limites=(n:number)=>Math.max(0,Math.min(100,n));

const getMood=(hunger:number,happiness:number,energy:number):PetMood=>{ 
  if(hunger>70) return PetMood.HUNGRY;
  if(energy<30) return PetMood.TIRED;
  if(happiness<30) return PetMood.SAD;
  if(happiness>80 && energy>70) return PetMood.EXCITED;
  if(happiness>60) return PetMood.HAPPY; 
  return PetMood.CONTENT;
}

const niveles=(v:number)=>(v>66?"high": v>33? "medium" : "low");
 
export const PetGame = () => {
  const [petName,setPetName]=useState("");
  const [start,setStart]=useState(false);
  const [hunger, setHunger]=useState(0);
  const [happiness, setHappiness]=useState(100);
  const [energy, setEnergy]=useState(100);

useEffect(()=>{
  if(!start) return;
  if (hunger >= 100 && happiness <= 0) return;

  const id=setInterval(()=>{
  setHunger((h)=>limites(h+10));
  setHappiness((h)=>limites(h-10));
},1000);
return ()=>clearInterval(id);
},[start,hunger,happiness]);

  const handleSubmit=(e:React.FormEvent)=>{
    e.preventDefault();
    const input=document.getElementById("pet-name") as HTMLInputElement;
    const name=input.value.trim();
    if(name){ setPetName(name); setStart(true);}
  }


const doAction = (action: Act) => {
  if (action === Act.EAT) {
    setHunger((h) => limites(h - 20));
    setEnergy((e) => limites(e + 10));
  }
  if (action === Act.PLAY) {
    setEnergy((e) => limites(e - 20));
    setHappiness((h) => limites(h + 10));
  }
  if (action === Act.SLEEP) {
    setHunger((h) => limites(h + 10));
    setEnergy((e) => limites(e + 20));
  }
};

  if(!start){
    return (
    <div className="base-container info-panel">
    <form className="start-questions" onSubmit={handleSubmit}>
    <h2>What is your pet name?</h2>
    <div>
    <input id="pet-name" type="text"/>
    <button id="set-name-btn" type="submit">Start Game</button>
    </div>
    </form>
    </div>
    );
  }


const mood=getMood(hunger,happiness,energy);

return(
  <div className="base-container">
  <h2 className="pet-name">{petName}</h2>
<div className="game-container">
<div className="pet-sprite">{emoji[mood]}</div>
<p>{PetMood[mood]}</p>
</div>
  <div className="stats-grid">

  <div className="stat stat-bar">
  <div className="stat-header">
  <span className="stat-name">Hunger</span>
  <span className="stat-value">{hunger}</span>
  </div>
  <div className="stat-progress">
  <div className={`stat-fill ${niveles(hunger)}`} style={{width:`${hunger}%`}}></div>
  </div>
  </div>

  <div className="stat stat-bar">
  <div className="stat-header">
  <span className="stat-name">Happiness</span>
  <span className="stat-value">{happiness}</span>
  </div>
    <div className="stat-progress">
  <div className={`stat-fill ${niveles(happiness)}`} style={{width:`${happiness}%`}}></div>
  </div>
  </div>


  <div className="stat stat-bar">
  <div className="stat-header">
  <span className="stat-name">Energy</span>
  <span className="stat-value">{energy}</span>
</div>
    <div className="stat-progress">
  <div className={`stat-fill ${niveles(energy)}`} style={{width:`${energy}%`}}></div>
  </div>
    </div>

   </div>

  <div className="pet-buttons game-container">
  <button id="eat-action" className="pet-button" onClick={()=>doAction(Act.EAT)}>EAT</button>
  <button id="play-action" className="pet-button" onClick={()=>doAction(Act.PLAY)}>PLAY</button>
  <button id="sleep-action" className="pet-button" onClick={()=>doAction(Act.SLEEP)}>SLEEP</button>
  </div>
  </div>
);

};
