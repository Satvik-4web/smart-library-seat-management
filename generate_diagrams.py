import urllib.request
import base64

# 1. Mermaid Gantt Chart
mermaid_code = """gantt
    title Smart Library Seat Management System - Timeline
    dateFormat  YYYY-MM-DD
    section Sprint 1: Foundation
    Requirements & SRS Draft      :done,    des1, 2026-09-01, 7d
    UI Wireframing & DB Schema    :done,    des2, after des1, 7d
    section Sprint 2: Core API
    Auth (SSO/JWT) setup          :active,  dev1, after des2, 5d
    Basic REST APIs (Seats, Zones):         dev2, after dev1, 9d
    section Sprint 3: Frontend
    Interactive SVG Floor Map     :         dev3, after dev2, 7d
    Real-time State Integration   :         dev4, after dev3, 7d
    section Sprint 4: State Engine
    Temporary Away Timer Logic    :         dev5, after dev4, 8d
    WebSocket Implementation      :         dev6, after dev5, 6d
    section Sprint 5: Admin Tools
    Admin Dashboard & Analytics   :         dev7, after dev6, 7d
    Maintenance & Heatmaps        :         dev8, after dev7, 7d
    section Sprint 6: Hardening
    Load Testing & Optimization   :         test1, after dev8, 7d
    Final Deployment              :         deploy1, after test1, 7d
"""

encoded_mermaid = base64.b64encode(mermaid_code.encode('utf-8')).decode('utf-8')
mermaid_url = f"https://mermaid.ink/img/{encoded_mermaid}"
print(f"Fetching {mermaid_url}")
req1 = urllib.request.Request(mermaid_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req1) as response, open("docs/assets/gantt_chart.png", 'wb') as out_file:
    out_file.write(response.read())
print("Gantt chart saved.")

# 2. PlantUML Use Case Diagram
plantuml_code = """@startuml
left to right direction
skinparam packageStyle rectangle
actor "Student" as student
actor "Library Admin" as admin
actor "System Timer" as timer
rectangle "Smart Library Seat Management System" {
  usecase "Authenticate (Login/SSO)" as UC1
  usecase "View Floor Map" as UC2
  usecase "Search Seats" as UC3
  usecase "Check-in to Seat" as UC4
  usecase "Activate Temp Away" as UC5
  usecase "Check-out" as UC6
  usecase "Auto-release Seat" as UC7
  usecase "View Analytics" as UC8
  usecase "Override Seat" as UC9
}
student --> UC1
student --> UC2
student --> UC3
student --> UC4
student --> UC5
student --> UC6
timer --> UC7
admin --> UC1
admin --> UC2
admin --> UC8
admin --> UC9
UC4 .> UC1 : <<includes>>
UC5 .> UC4 : <<extends>>
UC7 .> UC5 : <<includes>>
@enduml
"""

hex_code = plantuml_code.encode('utf-8').hex()
plantuml_url = f"http://www.plantuml.com/plantuml/png/~h{hex_code}"
print(f"Fetching {plantuml_url}")
req2 = urllib.request.Request(plantuml_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req2) as response, open("docs/assets/use_case_diagram.png", 'wb') as out_file:
    out_file.write(response.read())
print("Use Case diagram saved.")
