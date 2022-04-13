Geog 575 Final Project Proposal

Group: Michael Connolly, Joey Inskeep, Bryce Linden, Branton Kunz\
April 13, 2022\
User Profile (Persona)

Name & Position: Jacque Cousteau, Assistant to Member of European Parliament

Background  Description:  Cousteau is an Assistant to a Member of the European Parliament (MEP) who chairs the Committee on Industry, Research and Energy (ITRE). The committee is responsible for developing and maintaining energy policy for the European Union (EU). The committee works closely with the International Energy Agency (IEA), an intergovernmental organization of 31 countries, principally in Europe, that provides energy advice and data to its members.

Since the MEP has a broad range of public responsibilities, Cousteau acts as an energy specialist for the MEP and is responsible for understanding legislation and the reality of Europe's energy goals. Since the war in Ukraine started in February 2022, finding policy measures to promote independence from Russian natural gas has become a top priority. Although Cousteau is highly qualified in the area of European energy, he is not a true expert on the association of natural gas flow between Russia and the EU and the data that the IEA provides to the EU.  Cousteau contacted our mapping lab to produce an exploratory tool that would assist himself and other assistants of ITRE MEP members to better understand the IEA data on natural gas flows into Europe from Russia. They seek insights into which pipeline routes feed major European countries, to compare and rank how much natural gas flows through these routes, and what key infrastructure is associated with the routes to discover patterns and trends in the oil trade. If feasible they would like to visualize this alongside heating degree day data to see the effect that heating during a cold winter has on gas flows. The first iteration of the map will focus on pre-pandemic data from 2019, with other years added if feasible.\
User Case Scenario #1:

Upon arriving at the interactive, the European Parliament Member's assistant (user) is greeted with a sight level overview of proportional symbols representing natural gas coming in through the border where the major pipelines originating in Russia intersect these points. The proportional symbols are sized relative to the volume of natural gas being imported into the respective country. The user is prompted to select a proportional symbol on the map to retrieve natural gas import data regarding the amount of oil crossing the border and can begin analysis by comparing oil volumes imported between European countries. The user selects proportional symbols to identify locations that are of interest, to examine the flow of natural gas from Russia, and rank the volume of natural gas coming from the pipelines between border crossings.  The user also has the affordance to overlay a choropleth map representing net import of natural gas for the top 10 European countries in order to compare and rank which European countries import more oil from these pipelines. The user can pan and zoom into areas represented on the map to show natural gas trade associated with Russia and the European countries. The assistant then uses the information from the interface to advise the member of the EU parliament about the amount of natural gas being imported and the association of Russia to European countries regarding the natural gas trade and where the EU could look to different sources to secure energy needs.

User Case Scenario #2

Upon arriving at the interactive, the European Parliament Member's assistant (user) is greeted with a sight level overview. The user wishes to re-express the visual data from a map to a temporal line chart representing the monthly import data for the years 2019-2022 year-to-date for each European country selected. The user can also temporally sequence by month and year to see changes in natural gas imports being visually represented by proportional symbols. The user wants to examine trends in natural gas imports for each country per year and per month. The user can compare the monthly natural gas imports and rank the highest months of import to examine the data for anomalies. The user can advise the European Parliament Member on when to look for alternative energy sources during higher use months, as the conflict in Russia has made the fuel supply chain unpredictable.

 Requirements Document

|

Representation

 |
|

1.   

 |

Basemap

 |

Outline of Europe and Russia including boundaries for the 10 largest continental EU countries according to Gross Domestic Product (GDP) for 2019-2022: Germany, France, Italy, Spain, Netherlands, Poland, Belgium, Sweden, Austria, and Denmark.

Obtained from: Leaflet/OpenStreetMap, edited with MapBox.

 |
|

2.   

 |

Pipelines

 |

Pipeline routes between Russia and the EU including Nord Stream, Northern Lights / Yamal, Brotherhood / Soyuz, Trans-Balkan;[  https://www.entsog.eu/](https://www.entsog.eu/), [https://ec.europa.eu/eurostat/](https://ec.europa.eu/eurostat/statistics)

Depicted by polylines.

 |
|

3.   

 |

Gas Trade Flows

 |

IEA statistics on gas trade flows:

<https://www.iea.org/data-and-statistics/data-product/gas-trade-flows>

Depicted by country (choropleth [color variation]), border crossings (proportional symbol [size]).

 |
|

4.   

 |

Temperature

 |

Temperature / Climate statistics:

<https://climate.copernicus.eu/ESOTC/2019/european-temperature>

 |
|

5.   

 |

Border Crossings

 |

Depicted by proportional symbols linked by polylines representing pipelines, size and color variation of symbols depending on gas flows.

 |
|

6.   

 |

Timeline

 |

Depicts the natural gas trade flow between EU countries and Russia (when possible) by month/year in a line graph. D3 interactive.

 |
|

7.   

 |

Legend

 |

Visual description of countries (choropleth color value), border crossing points (proportional symbol / size), and pipelines (color).

 |
|

8.   

 |

Overview

 |

Documentation / context on the pipelines and energy trade between Russia and the EU, as well as user guidelines.

 |
|

Interaction

 |
|

1.   

 |

Overview

 |

Zoom (mouse and widget) and Pan (mouse): (location), adjust initial default view to focus on a particular feature (object) or concentrated area of features (objects). Also includes a  widget for resetting to default view.

 |
|

2.   

 |

Query Panel

 |

Filter: (location), gas source.

Overlay: (object), choropleth layer depicting net gas intake for each country (normalized per capita). 

Sequence: (time), by month (and year if timeline is expanded) to adjust default parameters.

 |
|

3.   

 |

Pipeline Hover

 |

Retrieve: (object), displays information about a selected pipeline.

 |
|

4.   

 |

Country Hover

 |

Retrieve: (object), displays data about a country -- GDP values, gas trade flow import/export and trade partners, temperature / climate values.

 |
|

5.   

 |

Border Crossing Hover

 |

Retrieve: (object), displays flow data for a border crossing proportional symbol.

 |
|

6.   

 |

Border Crossing Selection

 |

Reexpress: (objects), access the line chart/graph displaying gas trade flow and temperature data for selections to compare and rank values, and identify trends and associations over time. D3 interactive.

 |
|

7.   

 |

Line Graph Hover

 |

Retrieve: (objects), hover over a line on a graph to get the gas flow volume or temperature for a location / feature, also highlight that location / feature. D3 interactive.

 |
|

8.   

 |

Download

 |

Export: select features (objects) and data.

 |

3. Potential Wireframes
* Example 1
![ru1](https://user-images.githubusercontent.com/94699135/159348176-d925611c-06cd-43a4-82ca-315490051883.png)
![ru2](https://user-images.githubusercontent.com/94699135/159348187-ef420123-e3d3-487d-94a4-40e60734940d.png)
