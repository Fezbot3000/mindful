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
    color: "text-red-600",
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
          { id: "vengeful", name: "Vengeful" }
        ]
      }
    ]
  },
  {
    id: "fearful",
    name: "Fearful",
    color: "text-orange-600",
    children: [
      {
        id: "scared",
        name: "Scared",
        children: [
          { id: "terrified", name: "Terrified" },
          { id: "frightened", name: "Frightened" },
          { id: "overwhelmed", name: "Overwhelmed" },
          { id: "worried", name: "Worried" },
          { id: "alarmed", name: "Alarmed" }
        ]
      },
      {
        id: "anxious",
        name: "Anxious",
        children: [
          { id: "nervous", name: "Nervous" },
          { id: "submissive", name: "Submissive" },
          { id: "rejected", name: "Rejected" },
          { id: "humiliated", name: "Humiliated" },
          { id: "startled", name: "Startled" }
        ]
      },
      {
        id: "insecure",
        name: "Insecure",
        children: [
          { id: "inadequate", name: "Inadequate" },
          { id: "insignificant", name: "Insignificant" },
          { id: "worthless", name: "Worthless" },
          { id: "inferior", name: "Inferior" }
        ]
      },
      {
        id: "threatened",
        name: "Threatened",
        children: [
          { id: "exposed", name: "Exposed" },
          { id: "vulnerable", name: "Vulnerable" },
          { id: "victimized", name: "Victimized" },
          { id: "unsafe", name: "Unsafe" }
        ]
      }
    ]
  },
  {
    id: "disgusted",
    name: "Disgusted",
    color: "text-cyan-600",
    children: [
      {
        id: "disapproval",
        name: "Disapproval",
        children: [
          { id: "disappointed", name: "Disappointed" },
          { id: "awful", name: "Awful" },
          { id: "avoidance", name: "Avoidance" },
          { id: "displeased", name: "Displeased" }
        ]
      },
      {
        id: "judgmental",
        name: "Judgmental",
        children: [
          { id: "loathing", name: "Loathing" },
          { id: "repugnant", name: "Repugnant" },
          { id: "revolted", name: "Revolted" },
          { id: "detestable", name: "Detestable" }
        ]
      },
      {
        id: "aversion",
        name: "Aversion",
        children: [
          { id: "hesitant", name: "Hesitant" },
          { id: "repelled", name: "Repelled" },
          { id: "sickened", name: "Sickened" }
        ]
      }
    ]
  },
  {
    id: "surprised",
    name: "Surprised",
    color: "text-blue-600",
    children: [
      {
        id: "shocked",
        name: "Shocked",
        children: [
          { id: "stunned", name: "Stunned" },
          { id: "dismayed", name: "Dismayed" },
          { id: "disillusioned", name: "Disillusioned" },
          { id: "perplexed", name: "Perplexed" }
        ]
      },
      {
        id: "confused",
        name: "Confused",
        children: [
          { id: "puzzled", name: "Puzzled" },
          { id: "bewildered", name: "Bewildered" },
          { id: "baffled", name: "Baffled" },
          { id: "uncertain", name: "Uncertain" }
        ]
      },
      {
        id: "delighted",
        name: "Delighted",
        children: [
          { id: "amazed", name: "Amazed" },
          { id: "astonished", name: "Astonished" },
          { id: "awe", name: "Awe" },
          { id: "wonder", name: "Wonder" }
        ]
      },
      {
        id: "excited",
        name: "Excited",
        children: [
          { id: "eager", name: "Eager" },
          { id: "thrilled", name: "Thrilled" },
          { id: "energized", name: "Energized" },
          { id: "stimulated", name: "Stimulated" }
        ]
      }
    ]
  },
  {
    id: "happy",
    name: "Happy",
    color: "text-yellow-600",
    children: [
      {
        id: "joyful",
        name: "Joyful",
        children: [
          { id: "ecstatic", name: "Ecstatic" },
          { id: "elated", name: "Elated" },
          { id: "cheerful", name: "Cheerful" },
          { id: "delighted", name: "Delighted" }
        ]
      },
      {
        id: "content",
        name: "Content",
        children: [
          { id: "satisfied", name: "Satisfied" },
          { id: "pleased", name: "Pleased" },
          { id: "fulfilled", name: "Fulfilled" },
          { id: "grateful", name: "Grateful" }
        ]
      },
      {
        id: "peaceful",
        name: "Peaceful",
        children: [
          { id: "serene", name: "Serene" },
          { id: "calm", name: "Calm" },
          { id: "relaxed", name: "Relaxed" },
          { id: "tranquil", name: "Tranquil" }
        ]
      },
      {
        id: "confident",
        name: "Confident",
        children: [
          { id: "proud", name: "Proud" },
          { id: "accomplished", name: "Accomplished" },
          { id: "empowered", name: "Empowered" },
          { id: "successful", name: "Successful" }
        ]
      },
      {
        id: "loving",
        name: "Loving",
        children: [
          { id: "affectionate", name: "Affectionate" },
          { id: "caring", name: "Caring" },
          { id: "warm", name: "Warm" },
          { id: "connected", name: "Connected" }
        ]
      }
    ]
  },
  {
    id: "sad",
    name: "Sad",
    color: "text-purple-600",
    children: [
      {
        id: "lonely",
        name: "Lonely",
        children: [
          { id: "abandoned", name: "Abandoned" },
          { id: "isolated", name: "Isolated" },
          { id: "disconnected", name: "Disconnected" },
          { id: "empty", name: "Empty" }
        ]
      },
      {
        id: "depressed",
        name: "Depressed",
        children: [
          { id: "despair", name: "Despair" },
          { id: "hopeless", name: "Hopeless" },
          { id: "miserable", name: "Miserable" },
          { id: "defeated", name: "Defeated" }
        ]
      },
      {
        id: "grief",
        name: "Grief",
        children: [
          { id: "mourning", name: "Mourning" },
          { id: "loss", name: "Loss" },
          { id: "sorrow", name: "Sorrow" },
          { id: "heartbroken", name: "Heartbroken" }
        ]
      },
      {
        id: "shame",
        name: "Shame",
        children: [
          { id: "ashamed", name: "Ashamed" },
          { id: "guilty", name: "Guilty" },
          { id: "remorseful", name: "Remorseful" },
          { id: "regretful", name: "Regretful" }
        ]
      },
      {
        id: "powerless",
        name: "Powerless",
        children: [
          { id: "helpless", name: "Helpless" },
          { id: "weak", name: "Weak" },
          { id: "resigned", name: "Resigned" },
          { id: "apathetic", name: "Apathetic" }
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