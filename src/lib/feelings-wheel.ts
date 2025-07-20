export interface EmotionNode {
  id: string;
  name: string;
  children?: EmotionNode[];
  color?: string;
}

export const feelingsWheel: EmotionNode[] = [
  {
    id: "angry",
    name: "Angry",
    color: "text-foreground",
    children: [
      {
        id: "mad",
        name: "Mad",
        children: [
          { id: "hostile", name: "Hostile" },
          { id: "irritated", name: "Irritated" },
          { id: "resentful", name: "Resentful" },
          { id: "bitter", name: "Bitter" },
          { id: "spiteful", name: "Spiteful" }
        ]
      },
      {
        id: "aggressive",
        name: "Aggressive",
        children: [
          { id: "frustrated", name: "Frustrated" },
          { id: "critical", name: "Critical" },
          { id: "infuriated", name: "Infuriated" },
          { id: "annoyed", name: "Annoyed" }
        ]
      },
      {
        id: "withdrawn",
        name: "Withdrawn",
        children: [
          { id: "hurt", name: "Hurt" },
          { id: "suspicious", name: "Suspicious" },
          { id: "distant", name: "Distant" },
          { id: "cold", name: "Cold" }
        ]
      },
      {
        id: "revengeful",
        name: "Revengeful",
        children: [
          { id: "hateful", name: "Hateful" },
          { id: "violent", name: "Violent" },
          { id: "vindictive", name: "Vindictive" },
          { id: "malicious", name: "Malicious" }
        ]
      }
    ]
  },
  {
    id: "disgusted",
    name: "Disgusted",
    color: "text-muted-foreground",
    children: [
      {
        id: "revolted",
        name: "Revolted",
        children: [
          { id: "repugnant", name: "Repugnant" },
          { id: "nauseated", name: "Nauseated" },
          { id: "horrified", name: "Horrified" },
          { id: "detestable", name: "Detestable" }
        ]
      },
      {
        id: "awful",
        name: "Awful",
        children: [
          { id: "gross", name: "Gross" },
          { id: "sick", name: "Sick" },
          { id: "terrible", name: "Terrible" },
          { id: "repulsed", name: "Repulsed" }
        ]
      },
      {
        id: "judgmental",
        name: "Judgmental",
        children: [
          { id: "superior", name: "Superior" },
          { id: "disdainful", name: "Disdainful" },
          { id: "contempt", name: "Contempt" },
          { id: "critical", name: "Critical" }
        ]
      },
      {
        id: "disappointed",
        name: "Disappointed",
        children: [
          { id: "betrayed", name: "Betrayed" },
          { id: "appalled", name: "Appalled" },
          { id: "disillusioned", name: "Disillusioned" },
          { id: "repelled", name: "Repelled" }
        ]
      }
    ]
  },
  {
    id: "surprised",
    name: "Surprised",
    color: "text-foreground",
    children: [
      {
        id: "excited",
        name: "Excited",
        children: [
          { id: "eager", name: "Eager" },
          { id: "enthusiastic", name: "Enthusiastic" },
          { id: "energetic", name: "Energetic" },
          { id: "thrilled", name: "Thrilled" }
        ]
      },
      {
        id: "amazed",
        name: "Amazed",
        children: [
          { id: "astonished", name: "Astonished" },
          { id: "awe-struck", name: "Awe-struck" },
          { id: "wonderstruck", name: "Wonderstruck" },
          { id: "impressed", name: "Impressed" }
        ]
      },
      {
        id: "confused",
        name: "Confused",
        children: [
          { id: "perplexed", name: "Perplexed" },
          { id: "puzzled", name: "Puzzled" },
          { id: "bewildered", name: "Bewildered" },
          { id: "baffled", name: "Baffled" }
        ]
      },
      {
        id: "startled",
        name: "Startled",
        children: [
          { id: "shocked", name: "Shocked" },
          { id: "jolted", name: "Jolted" },
          { id: "stunned", name: "Stunned" },
          { id: "alarmed", name: "Alarmed" }
        ]
      }
    ]
  },
  {
    id: "afraid",
    name: "Afraid",
    color: "text-primary",
    children: [
      {
        id: "scared",
        name: "Scared",
        children: [
          { id: "frightened", name: "Frightened" },
          { id: "panicked", name: "Panicked" },
          { id: "terrified", name: "Terrified" },
          { id: "horrified", name: "Horrified" }
        ]
      },
      {
        id: "anxious",
        name: "Anxious",
        children: [
          { id: "worried", name: "Worried" },
          { id: "nervous", name: "Nervous" },
          { id: "tense", name: "Tense" },
          { id: "restless", name: "Restless" }
        ]
      },
      {
        id: "insecure",
        name: "Insecure",
        children: [
          { id: "vulnerable", name: "Vulnerable" },
          { id: "inadequate", name: "Inadequate" },
          { id: "uncertain", name: "Uncertain" },
          { id: "self-conscious", name: "Self-conscious" }
        ]
      },
      {
        id: "weak",
        name: "Weak",
        children: [
          { id: "powerless", name: "Powerless" },
          { id: "helpless", name: "Helpless" },
          { id: "fragile", name: "Fragile" },
          { id: "overwhelmed", name: "Overwhelmed" }
        ]
      }
    ]
  },
  {
    id: "happy",
    name: "Happy",
    color: "text-muted-foreground",
    children: [
      {
        id: "joyful",
        name: "Joyful",
        children: [
          { id: "ecstatic", name: "Ecstatic" },
          { id: "elated", name: "Elated" },
          { id: "jubilant", name: "Jubilant" },
          { id: "euphoric", name: "Euphoric" }
        ]
      },
      {
        id: "optimistic",
        name: "Optimistic",
        children: [
          { id: "hopeful", name: "Hopeful" },
          { id: "confident", name: "Confident" },
          { id: "positive", name: "Positive" },
          { id: "inspired", name: "Inspired" }
        ]
      },
      {
        id: "content",
        name: "Content",
        children: [
          { id: "peaceful", name: "Peaceful" },
          { id: "satisfied", name: "Satisfied" },
          { id: "fulfilled", name: "Fulfilled" },
          { id: "serene", name: "Serene" }
        ]
      },
      {
        id: "playful",
        name: "Playful",
        children: [
          { id: "amused", name: "Amused" },
          { id: "cheerful", name: "Cheerful" },
          { id: "delighted", name: "Delighted" },
          { id: "lighthearted", name: "Lighthearted" }
        ]
      }
    ]
  },
  {
    id: "sad",
    name: "Sad",
    color: "text-primary",
    children: [
      {
        id: "depressed",
        name: "Depressed",
        children: [
          { id: "empty", name: "Empty" },
          { id: "hopeless", name: "Hopeless" },
          { id: "despairing", name: "Despairing" },
          { id: "miserable", name: "Miserable" }
        ]
      },
      {
        id: "lonely",
        name: "Lonely",
        children: [
          { id: "isolated", name: "Isolated" },
          { id: "abandoned", name: "Abandoned" },
          { id: "rejected", name: "Rejected" },
          { id: "disconnected", name: "Disconnected" }
        ]
      },
      {
        id: "ashamed",
        name: "Ashamed",
        children: [
          { id: "humiliated", name: "Humiliated" },
          { id: "mortified", name: "Mortified" },
          { id: "embarrassed", name: "Embarrassed" },
          { id: "regretful", name: "Regretful" }
        ]
      },
      {
        id: "hurt",
        name: "Hurt",
        children: [
          { id: "wounded", name: "Wounded" },
          { id: "betrayed", name: "Betrayed" },
          { id: "heartbroken", name: "Heartbroken" },
          { id: "crushed", name: "Crushed" }
        ]
      }
    ]
  }
];

export function findEmotionPath(emotionId: string): EmotionNode[] {
  const path: EmotionNode[] = [];
  
  function search(nodes: EmotionNode[], targetId: string): boolean {
    for (const node of nodes) {
      path.push(node);
      
      if (node.id === targetId) {
        return true;
      }
      
      if (node.children && search(node.children, targetId)) {
        return true;
      }
      
      path.pop();
    }
    return false;
  }
  
  search(feelingsWheel, emotionId);
  return path;
}

export function getEmotionDepth(emotionId: string): number {
  return findEmotionPath(emotionId).length;
} 