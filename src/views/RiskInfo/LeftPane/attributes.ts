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
        descriptionNep: 'त्यस्ता डरलाग्दा परिघटना, वस्तु, मानवीय क्रियाकलाप, वा परिस्थिति जसका कारणले ज्यानको नोक्सानी, घाइते हुने सम्भावना वा अन्य स्वास्थ्यसम्बन्धी असरहरू, धनमालको क्षति, आजीविका (Livelihoods) तथा सेवाहरूको नोक्सानी, सामाजिक तथा आर्थिक गतिरोध, वा वातावरणीय ह्रास समेत निम्त्याउँछ ।',
        color: '#e53935',
        icon: 'H',
        iconNep: 'प्र',
    },
    {
        key: 'exposure',
        title: 'Exposure',
        titleNep: 'सम्मुखता',
        description: 'The situation of people, infrastructure, housing, production capacities and other tangible human assets located in hazard-prone areas.',
        descriptionNep: 'प्रकोप प्रभाव क्षेत्रमा अवस्थित भएका कारण संभाव्य क्षति वेहोर्ने अवस्थामा​ रहेका मानिस, धनमाल, संयन्त्र।',
        color: '#8e24aa',
        icon: 'E',
        iconNep: 'स',
    },
    {
        key: 'vulnerability',
        title: 'Vulnerability',
        titleNep: 'संकटासन्‍नता',
        description: 'The conditions determined by physical, social, economic and environmental factors or processes, which increase the susceptibility of an individual, a community, assets or systems to the impacts of hazards.',
        descriptionNep: 'कुनै समुदाय, कार्यप्रणाली वा जायजेथामाथि प्रकोपका असरहरू प्रत्यक्ष पर्न सक्ने अवस्था वा परिवेश ।',
        color: '#7c6200',
        icon: 'V',
        iconNep: 'सं',
    },
    {
        key: 'risk',
        title: 'Risk',
        titleNep: 'जोखिम',
        description: 'The potential loss of life, injury, or destroyed or damaged assets which could occur to a system, society or a community in a specific period of time, determined probabilistically as a function of hazard, exposure, vulnerability and capacity.',
        descriptionNep: 'कुनै पनि प्रकोप घटनाको सम्भाव्यता र त्यसका नकारात्मक परिमाणहरूको समग्र अवस्था नै जोखिम हो । प्रकोप जोखिम प्रकोपको मात्रा, त्यस क्षेत्रको सङ्कटासन्नता तथा सम्मुखतासँग सम्बन्धित हुन्छ ।',
        color: '#ff8f00',
        icon: 'R',
        iconNep: 'जो',
    },
    {
        key: 'capacity-and-resources',
        title: 'Capacity and resources',
        titleNep: 'श्रोत तथा क्षमता',
        description: 'The combination of all the strengths, attributes and resources available within an organization, community or society to manage and reduce disaster risks and strengthen resilience.',
        descriptionNep: 'उपलब्ध स्रोत–साधन, ज्ञान र सीपको समुचित उपयोग गरी प्रतिकूल अवस्था',
        color: '#1976d2',
        icon: 'CR',
        iconNep: 'श्रो',
    },
    {
        key: 'climate-change',
        title: 'Climate change',
        titleNep: 'जलवायु परिवर्तन',
        description: 'A change in the state of the climate that can be identified (e.g., by using statistical tests) by changes in the mean and/or the variability of its properties and that persists for an extended period, typically decades or longer. Climate change may be due to natural internal processes or external forcings, or to persistent anthropogenic changes in the composition of the atmosphere or in land use.',
        descriptionNep: 'मौसमको स्थितिमा परिवर्तन जुन पहिचान गर्न सकिन्छ (जस्तै, सांख्यिकीय परीक्षणहरू प्रयोग गरेर) माध्य र/वा यसको गुणहरूको परिवर्तनशीलतामा परिवर्तनहरू र जुन विस्तारित अवधिको लागि, सामान्यतया दशकहरू वा लामो समयसम्म रहन्छ। जलवायु परिवर्तन प्राकृतिक आन्तरिक प्रक्रिया वा बाह्य जबरजस्ती वा वायुमण्डलको संरचना वा भू-उपयोगमा निरन्तर मानववंशीय परिवर्तनका कारण हुन सक्छ।',
        color: '#689f38',
        icon: 'CC',
        iconNep: 'ज',
    },
];

export const attributeColorMap = listToMap(attributeList, d => d.key, d => d.color);
