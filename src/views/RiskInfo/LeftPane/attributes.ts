import { listToMap } from '@togglecorp/fujs';
import { AttributeKey } from '#types';

export interface AttributeItem {
    key: AttributeKey;
    title: string;
    titleNep: string;
    description?: string;
    descriptionNep: string;
    color?: string;
    icon: string;
    iconNep: string;
}

export const attributeListKeySelector = (d: AttributeItem) => d.key;

export const attributeList: AttributeItem[] = [
    {
        key: 'hazard',
        title: 'Hazard',
        titleNep: 'प्रकोप',
        description: 'A process, phenomenon or human activity that may cause loss of life, injury or other health impacts, property damage, social and economic disruption or environmental degradation.',
        descriptionNep: 'एक प्रक्रिया, घटना वा मानव गतिविधि जसले जीवनको हानि, चोटपटक वा अन्य स्वास्थ्य प्रभावहरू, सम्पत्ति क्षति, सामाजिक र आर्थिक अवरोध वा वातावरणीय ह्रास निम्त्याउन सक्छ।',
        color: '#e53935',
        icon: 'H',
        iconNep: 'प्र',
    },
    {
        key: 'exposure',
        title: 'Exposure',
        titleNep: 'सम्मुखता',
        description: 'The situation of people, infrastructure, housing, production capacities and other tangible human assets located in hazard-prone areas.',
        descriptionNep: 'जोखिम-प्रवण क्षेत्रहरूमा अवस्थित मानिसहरू, पूर्वाधार, आवास, उत्पादन क्षमता र अन्य मूर्त मानव सम्पत्तिहरूको अवस्था।',
        color: '#8e24aa',
        icon: 'E',
        iconNep: 'स',
    },
    {
        key: 'vulnerability',
        title: 'Vulnerability',
        titleNep: 'संकटासन्‍नता',
        description: 'The conditions determined by physical, social, economic and environmental factors or processes, which increase the susceptibility of an individual, a community, assets or systems to the impacts of hazards.',
        descriptionNep: 'भौतिक, सामाजिक, आर्थिक र वातावरणीय कारकहरू वा प्रक्रियाहरू द्वारा निर्धारित अवस्थाहरू, जसले जोखिमहरूको प्रभावहरूको लागि व्यक्ति, समुदाय, सम्पत्ति वा प्रणालीहरूको संवेदनशीलता बढाउँछ।',
        color: '#7c6200',
        icon: 'V',
        iconNep: 'सं',
    },
    {
        key: 'risk',
        title: 'Risk',
        titleNep: 'जोखिम',
        description: 'The potential loss of life, injury, or destroyed or damaged assets which could occur to a system, society or a community in a specific period of time, determined probabilistically as a function of hazard, exposure, vulnerability and capacity.',
        descriptionNep: 'प्रकोप, सम्मुखता, संकटासन्‍नता र क्षमताको कार्यको रूपमा सम्भावित रूपमा निर्धारित समयको निश्चित अवधिमा प्रणाली, समाज वा समुदायमा हुन सक्ने जीवन, चोटपटक, वा नष्ट वा क्षतिग्रस्त सम्पत्तिको सम्भावित हानि।',
        color: '#ff8f00',
        icon: 'R',
        iconNep: 'जो',
    },
    {
        key: 'capacity-and-resources',
        title: 'Capacity and resources',
        titleNep: 'क्षमता र स्रोतहरु',
        description: 'The combination of all the strengths, attributes and resources available within an organization, community or society to manage and reduce disaster risks and strengthen resilience.',
        descriptionNep: 'संस्था, समुदाय वा समाजमा उपलब्ध सबै शक्ति, विशेषता र स्रोतहरूको संयोजन विपद् जोखिमहरू व्यवस्थापन र कम गर्न र लचिलोपनलाई बलियो बनाउन।',
        color: '#1976d2',
        icon: 'CR',
        iconNep: 'क्ष',
    },
    {
        key: 'climate-change',
        title: 'Climate change',
        titleNep: 'मौसम परिवर्तन',
        description: 'A change in the state of the climate that can be identified (e.g., by using statistical tests) by changes in the mean and/or the variability of its properties and that persists for an extended period, typically decades or longer. Climate change may be due to natural internal processes or external forcings, or to persistent anthropogenic changes in the composition of the atmosphere or in land use.',
        descriptionNep: 'मौसमको स्थितिमा परिवर्तन जुन पहिचान गर्न सकिन्छ (जस्तै, सांख्यिकीय परीक्षणहरू प्रयोग गरेर) माध्य र/वा यसको गुणहरूको परिवर्तनशीलतामा परिवर्तनहरू र जुन विस्तारित अवधिको लागि, सामान्यतया दशकहरू वा लामो समयसम्म रहन्छ। जलवायु परिवर्तन प्राकृतिक आन्तरिक प्रक्रिया वा बाह्य जबरजस्ती वा वायुमण्डलको संरचना वा भू-उपयोगमा निरन्तर मानववंशीय परिवर्तनका कारण हुन सक्छ।',
        color: '#689f38',
        icon: 'CC',
        iconNep: 'मौ',
    },
];

export const attributeColorMap = listToMap(attributeList, d => d.key, d => d.color);
