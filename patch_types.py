import re

with open('src/types.ts', 'r', encoding='utf-8') as f:
    content = f.read()

types_replacement = """export type CategoryType = 
  | 'living_infrastructure' 
  | 'living_environment'    
  | 'living_community'      
  | 'bustle_landscape'      
  | 'bustle_tourism'        
  | 'other_concept';        

export type AgeGroup = 
  | 'under_10s'
  | '10s'
  | '20s'
  | '30s'
  | '40s'
  | '50s'
  | '60s'
  | '70s'
  | '80s_plus';

export type ResidencyArea = 
  | 'yanai_student'     
  | 'commuter'          
  | 'downtown_resident' 
  | 'suburban_resident' 
  | 'tourist_fan';      """

content = re.sub(
    r"export type CategoryType =[\s\S]*?; // 観光・関係人口\n",
    types_replacement + "\n",
    content
)

with open('src/types.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("patched types.ts")
