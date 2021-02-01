import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { chapters } from '../config';
import accessibility from '../data/assets/accessibility.jpg';
import buildings from '../data/assets/buildings.png';
import elevation from '../data/assets/elevation.png';
import precip from '../data/assets/precip.png';
import evacCenters from '../data/assets/evac_centers.png';
import popHazard from '../data/assets/pop_hazard.png';
import idealCoverage from '../data/assets/ideal_coverage.png';
import sampaguita from '../data/assets/sampaguita_gym.png';

export default class Panel extends React.Component {
    public constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
    }

    public componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, true);
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll, true);
    }

    public setActiveChapter = (newChapter) => {
        const { chapterName, updateChapter } = this.props;

        if (newChapter === chapterName) return;

        document.getElementById(newChapter).setAttribute('class', 'active');
        document.getElementById(chapterName).setAttribute('class', '');

        updateChapter(newChapter);
    }

    public isElementOnScreen = (id) => {
        const element = document.getElementById(id);
        const bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
    }

    public handleScroll = (e) => {
        const chapterNames = Object.keys(chapters);
        let i;

        for (i = 0; i < chapterNames.length; i += 1) {
            const chapterName = chapterNames[i];
            if (this.isElementOnScreen(chapterName)) {
                this.setActiveChapter(chapterName);
                break;
            }
        }
    }


    public render() {
        return (
            <div id="features" onScroll={this.handleScroll}>
                <section id="marikina" className="active">
                    <Typography variant="h3">Marikina City</Typography>
                    <Typography>
            A highly urbanized city in the capital region of
            the Philippines, it lies in a valley surrounded by the
             mountains of Sierra Madre in the east and the hills of
             Quezon City in the west. Situated near the center of the
             Pasig-Marikina river basin, most of the city sits at an elevation of
                        {' '}
                        <span className="highlight">15 meters above sea level</span>
.
                    </Typography>
                    <br />
                    <img className="figure" src={elevation} alt="Distribution of land elevations" />
                    <br />
                    <Typography variant="h6">CLIMATE &amp; ANNUAL PRECIPITATION</Typography>
                    <Typography>
                        Like the rest of the country, Marikina experiences a
                        {' '}
                        <span className="highlight">tropical monsoon climate</span>
                        {' '}
                        with average temperatures from 20 &deg;C to 34 &deg;C. Although
                         these can feel warmer because of high humidity. The dry season
                         starts January through May, bringing around 1.5 inches of rain.
                         For the rest of the year, Marikina experiences its wet season
                         which pours around 5 to 17 inches of rain, with heavy downpours
                         from August to October. Overall in a year, Marikina experiences
                        {' '}
                        <span className="highlight">82 inches</span>
                        {' '}
of rain on average (
                        <i>
Source:
                            <a
                                href="https://en.wikipedia.org/wiki/Marikina"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
Wikipedia

                            </a>
                        </i>
).
                    </Typography>
                    <br />
                    <img className="figure" src={precip} alt="Average precipitation per month in Marikina" />
                </section>
                <section id="land">
                    <Typography variant="h3">A River Runs through It</Typography>
                    <Typography>
            The
                        {' '}
                        <span className="highlight">Marikina River</span>
                        {' '}
                        runs at the heart of the city, draining off rain water
                         through its tributaries to Laguna de Bay. In its 38
                         kilometer stretch, its depth ranges from 3 to 21 meters,
                         and its segments can span from 70 to 120 meters. Because
                         it runs through to the lower stretch of the basin, the
                         riverbanks only have elevations as high as 8 down to 2
                          meters above sea level.
                    </Typography>
                    <br />
                    <Typography variant="h6">CALL TO ACTION</Typography>
                    <Typography>
            Acting as its lifeblood, many of Marikina residential subdivisions,
             commercial buildings and critical health and education facilities have
              been built near the river. With continuous developments around it coupled
               with the constant threat of flooding, Marikina remains a focus of
               the national government’s efforts for flood control and disaster management (
                        <i>
Source:
                            <a
                                href="https://en.wikipedia.org/wiki/Marikina_River"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
Wikipedia

                            </a>
                        </i>
).
                    </Typography>
                    <br />
                    <img className="figure" src={buildings} alt="Distribution of buildings in Marikina" />
                </section>
                <section id="typhoon">
                    <Typography variant="h3">T.S. Ondoy</Typography>
                    <Typography>
            Like a shield to its southeast asian neighbors, the
            Philippines welcomes around twenty tropical cyclones in
            its area of responsibility. Around ten of them become actual
            typhoons and make landfall, with five of those potentially
            bringing destructive winds and heavy rains. This makes the
            Philippines the most exposed to tropical storms &mdash;

            an unfortunate record to bear (
                        <i>
Source:
                            <a
                                href="https://en.wikipedia.org/wiki/Typhoons_in_the_Philippines"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
Wikipedia

                            </a>
,
                            <a
                                rel="noopener noreferrer"
                                href="http://world.time.com/2013/11/11/the-philippines-is-the-most-storm-exposed-country-on-earth/"
                                target="_blank"
                            >
                                Time

                            </a>
                        </i>
).
                    </Typography>
                    <br />
                    <Typography variant="h6">EXTENT &amp; IMPACT</Typography>
                    <Typography>
            On September 26, 2009, tropical storm “Ondoy” (typhoon “Ketsana”)
            made landfall and for 12 hours, flooded Metro Manila and Central Luzon.
             Catching everyone by surprise, it continuously dumped around 341 mm
             (14 in) of rain in just 6 hours and within 24 hours, a record-high 455
              mm (17.9 in) of rainfall was reported. In its aftermath, around 464
              people drowned and 11 billion pesos worth of infrastructure and
              agriculture were damaged (
                        <i>
Source:
                            <a
                                href="https://en.wikipedia.org/wiki/Typhoon_Ketsana"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
Wikipedia

                            </a>
,
                            <a
                                rel="noopener noreferrer"
                                href="https://newsinfo.inquirer.net/818907/special-report-on-storm-ondoy-marikina-remembers-end-of-the-world"
                                target="_blank"
                            >
Inquirer

                            </a>
                        </i>
).
                    </Typography>
                    <br />
                    <Typography variant="h6">MARIKINA, HARDEST HIT</Typography>
                    <Typography>
            With almost a month’s worth of rainfall that befell in less than
            a day, Marikina river rose to 23 meters above sea level. Considered
            as the worst flooding with heights that reached around 20 feet, its
            extent reached 14 of Marikina’s 16
                        {' '}
                        <i>barangays</i>
                        {' '}
            (towns). Many of its health centers were flooded,
            damaging their stocks of medicine and equipment. Marikina suffered
             70 deaths and 27 million pesos in damages, making it one of the
             hardest hit cities in Metro Manila.  (
                        <i>
            Source:
                            <a
                                rel="noopener noreferrer"
                                href="https://newsinfo.inquirer.net/818907/special-report-on-storm-ondoy-marikina-remembers-end-of-the-world"
                                target="_blank"
                            >
Inquirer

                            </a>
,
                            <a
                                rel="noopener noreferrer"
                                href="https://reliefweb.int/report/philippines/philippines-typhoon-ondoy-health-cluster-situation-report-1"
                                target="_blank"
                            >
Reliefweb

                            </a>
                        </i>
).
                    </Typography>
                </section>
                <section id="evacuation">
                    <Typography variant="h3">Evacuation</Typography>
                    <Typography>
            Completely unaware, many families in low lying areas
            were stranded in their upper floors while others climbed to
             their roofs. In Marikina, around 14 to 23 available schools
              and evacuation centers took people in, as well as some churches.
                        {' '}
                        <span className="highlight">how suitable are the current evacuation centers and their locations in sheltering Marikina’s citizens from peril?</span>
                    </Typography>
                    <br />
                    <Typography>
            First, let’s look at what the current evacuation centers are like.
                    </Typography>
                    <br />
                    <img className="figure" src={evacCenters} alt="Distribution of buildings in Marikina" />
                    <br />
                    <Typography>
            While these buildings might seem practical for a few
             days of stay, there are always concerns whether there is
                        {' '}
                        <span className="highlight">enough space and provisions for privacy, proper sanitation and healthcare</span>
                    </Typography>
                    <br />
                    <Typography variant="h6">HAZARD EXPOSURE</Typography>
                    <Typography>
            Twelve evacuation centers are located in medium to high hazard areas
            for a 5-year flood return period, almost a third of their number.
             This jumps to 21 evacuation centers for a 100-year return period,
              fifteen of which are schools. While many of these schools are
              multi-storey buildings with at least 3-4 floors, evacuees in
              these shelters can still get stranded and make them unable to

              access other critical facilities nearby.
                    </Typography>
                </section>
                <section id="population">
                    <Typography variant="h3">Population</Typography>
                    <Typography>
            Marikina City has 450,741 citizens.
                        {' '}
                        <span className="highlight">How many of them are exposed to flooding hazard?</span>
                    </Typography>
                    <br />
                    <img className="figure" src={popHazard} alt="Distribution of exposed population per return period" />
                    <br />
                    <Typography>
            If we look at the flood hazard for a 5-year return period, around
                        {' '}
                        <span className="highlight">
                            47% of the population are exposed to high and medium hazards

                        </span>
,                       which is already a sizeable number of people. This percentage jumps to
                        {' '}
                        <span className="highlight">65%</span>
                        {' '}
                            and
                        {' '}
                        <span className="highlight">69%</span>
                        {' '}
                        of the population for the 25- and 100-year return periods, respectively.
                    </Typography>
                    <br />
                    <Typography>
                        <span className="highlight">
Can these people easily go to a
                        nearby evacuation center?

                        </span>
                        {' '}
A                       nd if they can,
                        {' '}
                        <span className="highlight">will there be enough space and other provisions?</span>
                    </Typography>
                </section>
                <section id="coverage">
                    <Typography variant="h3">Ideal Coverage</Typography>
                    <Typography>
            If we draw
                        {' '}
                        <span className="highlight">400 m</span>
                        {' '}
                circles around each evacuation center, the map shows how many
                people can reach them within an acceptable walking distance.
                What do these mean? We can consider these as the
                        {' '}
                        <span className="highlight">
ideal number of people
                         that each evacuation center should be able to shelter

                        </span>
                        {' '}
in times of disaster. Currently,
                        {' '}
                        <span className="highlight">86%</span>
                        {' '}
of the population are in close proximity to at least one evacuation center.
                    </Typography>
                    <br />
                    <img className="figure" src={idealCoverage} alt="Population covered within 400 meters" />
                    <br />
                    <Typography>
            There are also many evacuation centers that
                        {' '}
                        <span className="highlight">overlap ideal coverage</span>
, which can be a good thing for citizens. There are around
                        {' '}
                        <span className="highlight">35%</span>
                        {' '}
of the population with at least two evacuation centers nearby, and
                        {' '}
                        <span className="highlight">3% of them are near to four shelters</span>
. And if we look at the map, these clusters of evacuation centers are
 nicely located in relatively population dense areas, suggesting good
 coverage and availability of options.
                    </Typography>
                </section>
                <section id="capacity">
                    <Typography variant="h3">Estimated Capacity</Typography>
                    <Typography>
            Now that we know the ideal number of people that each evacuation center should serve,
                        {' '}
                        <span className="highlight">how many can they actually fit?</span>
                        {' '}
We got the total floor areas and computed for the estimated number of
people that can comfortably stay in these shelters (
                        <span className="highlight">
5 sqm of space
                        per person

                        </span>
). All locations had an estimated capacity
                        {' '}
                        <span className="highlight">way below their ideal coverage</span>
, which means there won’t be enough space if everyone within close
proximity have to evacuate. On average, there is a sizeable difference of around
                        {' '}
                        <span className="highlight">10,416 people</span>
                        {' '}
that will be underserved per evacuation center.
                    </Typography>
                    <br />
                    <img className="figure" src={sampaguita} alt="Sampaguita Gym in Marikina" />
                    <br />
                    <Typography>
            To illustrate some of these differences, here is
                        {' '}
                        <span className="highlight">Sampaguita Gym</span>
                        {' '}
with an estimated capacity of only
                        {' '}
                        <span className="highlight">123 people</span>
                        {' '}
evacuating and staying comfortably within its vicinity. However,
because of the dense population within close proximity, it needs to serve
                        {' '}
                        <span className="highlight">168 times more people</span>
. While Malanday National HS, Malanday Elementary School and Filip
inas Gym are other nearby options, they too are well below their capacities, with
                        {' '}
                        <span className="highlight">Filipinas Gym</span>
                        {' '}
expected to shelter
                        {' '}
                        <span className="highlight">127 times more</span>
.
                        {' '}
                        <i>(Photo credit: Google Streetview)</i>
                    </Typography>
                </section>
                <section id="accessibility">
                    <Typography variant="h3">Accessibility</Typography>
                    <Typography>
            We also looked into the accessibility of the evacuation
             centers by generating isochrones that represent
                        {' '}
                        <span className="highlight">
areas that can
                         be reached from 5 to 30 minutes

                        </span>
. It can be seen from the map that all evacuation centers can already
 be reached by the majority of the population in
                        {' '}
                        <span className="highlight">15 minutes</span>
, which is beneficial for urgent evacuations at the onset of a heavy
downpour. However, these isochrones cannot account for the effects of
flooding on one’s walking speed if evacuations will happen during a deluge.
                    </Typography>
                    <br />
                    <img className="figure" src={accessibility} alt="People walking on flooded roads" />
                    <br />
                    <i>
(Photo credit:
                        {' '}
                        <a
                            className="fig-caption"
                            rel="noopener noreferrer"
                            href="http://archive.boston.com/bigpicture/2009/09/typhoon_ketsana_ondoy.html"
                            target="_blank"
                        >
boston.com

                        </a>
)
                    </i>
                </section>
                <section id="suitability">
                    <Typography variant="h3">Suitability</Typography>
                    <Typography>
            By considering the various factors such as
                        {' '}
                        <span className="highlight">
flood hazard
                        level, land elevation, land cover,
                        accessibility to road networks and the
                        maximum population coverage of an evacuation center

                        </span>
, we derived a suitability score for each area. The suitability
 score gives us an idea of how ideal a certain area is for an
 evacuation center to be built to be able to minimize the risks.
                    </Typography>
                    <br />
                    <Typography>
            The basis of the suitability score varied depending on the
            flood hazard level to be able to factor in cases of high-rising
             flood and low-rising flood. If we look at the suitability map
             for a 5-year return period,
                        {' '}
                        <span className="highlight">
over 52% of the city
                        has low to very low suitability

                        </span>
. The percentage increases to approximately
                        {' '}
                        <span className="highlight">64%</span>
                        {' '}
and
                        {' '}
                        <span className="highlight">69%</span>
                        {' '}
for the 25- and 100-year return periods respectively.
                    </Typography>
                    <br />
                    <Typography>
            Out of the 28 evacuation centers,
                        {' '}
                        <span className="highlight">only 3 evacuation centers</span>
                        {' '}
will be in very high suitability areas up until the 100-year return period.
There are 13 which would stay in high suitability areas, but the remaining 12
will be in low suitability areas by the 100-year return period.
                    </Typography>
                </section>
                <section id="good-place">
                    <Typography variant="h3">The Good Places</Typography>
                    <Typography>
            Despite a large area of Marikina considered to have low suitability
            for flood evacuation centers, there are some large
                        {' '}
                        <span className="highlight">very high suitable areas</span>
                        {' '}
that we can notice. The largest area is found in the neighborhood of
                        {' '}
                        <span className="highlight">Marikina Heights</span>
                        {' '}
at the eastern side of the city. This area is composed of mountains and
numerous narrow alleys which act as
                        {' '}
                        <span className="highlight">catch basins</span>
                        {' '}
during the floods. In the recent flooding due to Typhoon Karding, this
area reported no flooding possibly due to its
                        {' '}
                        <span className="highlight">topographical characteristics</span>
                        {' '}
and
                        {' '}
                        <span className="highlight">developed facilities</span>
                        {' '}
like drainage and pumping stations to accommodate the
                        {' '}
                        <span className="highlight">high population</span>
.
                    </Typography>
                    <br />
                    <Typography>
            The second largest very high suitable area is found at the
            western side of the Marikina River with
                        {' '}
                        <span className="highlight">Ateneo De Manila University</span>
                        {' '}
as a neighbor on the west. The university area is
                        {' '}
                        <span className="highlight">
almost entirely
                        covered in grass with some scattered trees

                        </span>
. Compared to other areas
                        {' '}
                        <span className="highlight">right beside the river</span>
, this area has a
                        {' '}
                        <span className="highlight">higher elevation</span>
                        {' '}
and experiences
                        {' '}
                        <span className="highlight">very little flooding</span>
.
                    </Typography>
                    <br />
                    <Typography>
            On the other side of the Marikina River, another very
             high suitable area can be observed and it is
                        {' '}
                        <span className="highlight">relatively closer to the river</span>
                        {' '}
compared to the previous area mentioned. Aside from its relatively
                        {' '}
                        <span className="highlight">large concentration of people</span>
, the high suitability score could be attributed to
                        {' '}
                        <span className="highlight">numerous passable roads</span>
                        {' '}
and spots of
                        {' '}
                        <span className="highlight">greenery</span>
                        {' '}
contributed by golf lots, sports complexes and other leisure
accommodations within the vicinity.
                    </Typography>
                </section>
                <section id="conclusion">
                    <Typography variant="h3">Moving Forward</Typography>
                    <Typography>
            In this analysis of Marikinas evacuation centers, we have
            illustrated how unsuitable many of them are in terms of their
                        {' '}
                        <span className="highlight">medium to high exposure to flooding</span>
                        {' '}
and
                        {' '}
                        <span className="highlight">incapacity to serve nearby residents</span>
. We then tried to look into the suitability of other areas, hoping to find
                        {' '}
                        <span className="highlight">viable locations for new evacuation centers</span>
. We found Marikina Heights as the most viable location for evacuation
centers. But anything built there cannot serve other densely populated areas.
                    </Typography>
                    <br />
                    <Typography>
            What about other suitable locations that are already built up land?
            There is always the option of finding existing buildings other than
            schools and covered courts that can also serve as shelters. However,
            we highly suggest that Marikina explore
                        {' '}
                        <span className="highlight">developing multipurpose buildings</span>
                        {' '}
like those built in Singapore to account for the lack of space in many residential areas.
                    </Typography>
                    <br />
                    <Typography>
            While Marikina can be lauded in the herculean task of effectively
            instituting information campaigns and building flood control
            infrastructures, it is also important that they look into critical
            infrastructures that are heavily utilized at the onset, during and
            soon after a typhoon or flooding. Although these are temporary relief,
             evacuees experiences in these shelters will definitely set the tone
             for their successful return and recovery.
                    </Typography>
                    <br />
                    <Typography variant="h6">WINNINGS</Typography>
                    <Typography>
            This interactive scrollytelling won
                        {' '}
                        <span className="highlight">GRAND PRIZE</span>
🏆 and the
                        {' '}
                        <span className="highlight">Best Interaction Design</span>
🎖 award for the
                        {' '}
                        <span className="highlight">#VizRisk Challenge</span>
! Read the announcement of winners from the
                        {' '}
                        <a
                            rel="noopener noreferrer"
                            href="https://blogs.worldbank.org/opendata/visualizing-risk-announcing-winners-vizrisk-2019-challenge"
                            target="_blank"
                        >
World Bank Group

                        </a>
.
                    </Typography>
                    <br />
                    <Typography variant="h6">THE TEAM</Typography>
                    <Typography>
            This is the proud work of
                        {' '}
                        <span className="highlight">Briane Paul V. Samson</span>
                        {' '}
from
                        {' '}
                        <a
                            rel="noopener noreferrer"
                            href="https://www.fun.ac.jp/en/"
                            target="_blank"
                        >
Future University Hakodate

                        </a>
                        {' '}
&amp;
                        {' '}
                        <a
                            rel="noopener noreferrer"
                            href="https://www.dlsu.edu.ph/"
                            target="_blank"
                        >
De La Salle University

                        </a>
                        {' '}
and
                        {' '}
                        <span className="highlight">Unisse C. Chua</span>
                        {' '}
from
                        {' '}
                        <a
                            rel="noopener noreferrer"
                            href="https://www.dlsu.edu.ph/"
                            target="_blank"
                        >
De La Salle University

                        </a>
. They are both from the
                        {' '}
                        <a
                            rel="noopener noreferrer"
                            href="https://comet.dlsu.edu.ph"
                            target="_blank"
                        >
Center for Complexity and Emerging Technologies

                        </a>
                        {' '}
in De La Salle University, Philippines. This wouldnt be possible
without the help of Winfred Villaluna,
Darlene Marpa, Tyler Venzon and Benson Polican in collecting and processing parts of the data.
                    </Typography>
                    <br />
                    <Typography variant="h6">CODE</Typography>
                    <Typography>
            If you are interested in replicating our work, you can clone our
                        {' '}
                        <a
                            rel="noopener noreferrer"
                            href="https://github.com/dlsucomet/riesgo-vis"
                            target="_blank"
                        >
GitHub repository

                        </a>
.
                    </Typography>
                </section>
            </div>
        );
    }
}

Panel.propTypes = {
    chapterName: PropTypes.string.isRequired,
    updateChapter: PropTypes.func.isRequired,
};
