import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis } from 'recharts';
import styles from './styles.scss';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import BulletIcon from '#resources/icons/Bullet.svg';
import PrimaryButton from '#rsca/Button/PrimaryButton';

interface Props {
    keyTab: number;
    showTabs: boolean;
    hideWelcomePage: () => void;
}

const ReportModal: React.FC<Props> = (props: Props) => {
    const { keyTab, showTabs, hideWelcomePage } = props;
    const handleWelcomePage = () => hideWelcomePage();
    // eslint-disable-next-line new-cap


    const handlePreviewBtn = () => {
        const divToDisplay = document.getElementById('reportPreview');
        html2canvas(divToDisplay).then((canvas) => {
            const divImage = canvas.toDataURL('image/png');
            const pdf = new JsPDF();
            pdf.addImage(divImage, 'PNG', 0, 0);
            pdf.save('preview.pdf');
        });
    };

    const lineData = [
        {
            name: 'Jan', AvgMax: 23, DailyAvg: 15, AvgMin: 7,
        },
        {
            name: 'Feb', AvgMax: 30, DailyAvg: 19, AvgMin: 9,
        },
        {
            name: 'Mar', AvgMax: 35, DailyAvg: 23, AvgMin: 11,
        },
        {
            name: 'Apr', AvgMax: 40, DailyAvg: 28, AvgMin: 16,
        },
        {
            name: 'May', AvgMax: 41, DailyAvg: 32, AvgMin: 23,
        },
        {
            name: 'Jun', AvgMax: 40, DailyAvg: 33, AvgMin: 26,
        },
        {
            name: 'Jul', AvgMax: 37, DailyAvg: 31.5, AvgMin: 26,
        },
        {
            name: 'Aug', AvgMax: 33, DailyAvg: 29, AvgMin: 25,
        },
        {
            name: 'Sep', AvgMax: 33, DailyAvg: 27.5, AvgMin: 22,
        },
        {
            name: 'Oct', AvgMax: 33, DailyAvg: 23.5, AvgMin: 14,
        },
        {
            name: 'Nov', AvgMax: 31, DailyAvg: 20, AvgMin: 9,
        },
        {
            name: 'Dec', AvgMax: 27, DailyAvg: 17, AvgMin: 7,
        },
    ];

    return (
        <>
            {!showTabs
        && (
            <div className={styles.firstPageContainer}>
                <div className={styles.title}>
                    GET STARTED
                </div>
                <div className={styles.description}>
                    In publishing and graphic design, Lorem ipsum is a
                    placeholder text commonly used to demonstrate the
                    visual form of a document or a typeface without
                    relying on meaningful content. Lorem ipsum may be
                    used as a placeholder before final copy is available.
                </div>

                <div className={styles.subtitle}>
                    What you can do with palika report.
                </div>
                <div className={styles.bulletPtRow}>
                    <div className={styles.bulletsContainer}>
                        <ScalableVectorGraphics
                            className={styles.bulletPoint}
                            src={BulletIcon}
                            alt="Bullet Point"
                        />
                        <div className={styles.bulletText}>
                             Know where your palika is in terms of DRR
                        </div>
                    </div>
                    <div className={styles.bulletsContainer}>
                        <ScalableVectorGraphics
                            className={styles.bulletPoint}
                            src={BulletIcon}
                            alt="Bullet Point"
                        />
                        <div className={styles.bulletText}>
                            Track the progress you palika is doing in terms of implementation of DRR
                        </div>
                    </div>
                </div>
                <div className={styles.bulletPtRow}>
                    <div className={styles.bulletsContainer}>
                        <ScalableVectorGraphics
                            className={styles.bulletPoint}
                            src={BulletIcon}
                            alt="Bullet Point"
                        />
                        <div className={styles.bulletText}>
                            Know the capacities and resources you have within the municipality.
                        </div>
                    </div>
                    <div className={styles.bulletsContainer}>
                        <ScalableVectorGraphics
                            className={styles.bulletPoint}
                            src={BulletIcon}
                            alt="Bullet Point"
                        />
                        <div className={styles.bulletText}>
                             Check how you palika is spending Budget in DRR
                        </div>
                    </div>
                </div>
                <div className={styles.btnContainer}>
                    <PrimaryButton
                        type="button"
                        className={styles.agreeBtn}
                        onClick={handleWelcomePage}
                    >
                        PROCEED
                    </PrimaryButton>
                </div>

            </div>
        )

            }
            <div id={'reportPreview'}>


                {
                    (keyTab === 1
               && showTabs) || (keyTab === 11 && showTabs)
                        ? (
                            <>
                                <div className={styles.tabsPageContainer}>
                                    <Table striped bordered hover size="lg">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>FISCAL YEAR</th>
                                                <th>TOTAL BUDGET NRS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>2064/2065</td>
                                                <td>Policy Points</td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>2064/2065</td>
                                                <td>Policy Points</td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>2064/2065</td>
                                                <td>Policy Points</td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>2064/2065</td>
                                                <td>Policy Points</td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>2064/2065</td>
                                                <td>Policy Points</td>
                                            </tr>

                                        </tbody>
                                    </Table>

                                </div>

                            </>
                        )
                        : ''
                }
                {
                    (keyTab > 1 && keyTab < 10
               && showTabs) || (keyTab === 11 && showTabs)
                        ? (
                            <>
                                <div className={styles.tabsPageContainer}>
                                    <Table striped bordered hover size="lg">
                                        <thead>
                                            <tr>
                                                <th>Activity Name</th>
                                                <th>Fund Type</th>
                                                <th>Budget Code</th>
                                                <th>Expense Title</th>
                                                <th>Amount NRs</th>
                                                <th>Remarks</th>
                                                <th>Annual Budget NRs</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Some activity</td>
                                                <td>Dollar fund</td>
                                                <td>112399YT</td>
                                                <td>Tea and Coffee</td>
                                                <td>1Bn</td>
                                                <td>Expensive Tea</td>
                                                <td>2Bn</td>
                                            </tr>
                                            <tr>
                                                <td>Some activity</td>
                                                <td>Dollar fund</td>
                                                <td>112399YT</td>
                                                <td>Tea and Coffee</td>
                                                <td>1Bn</td>
                                                <td>Expensive Tea</td>
                                                <td>2Bn</td>
                                            </tr>
                                            <tr>
                                                <td>Some activity</td>
                                                <td>Dollar fund</td>
                                                <td>112399YT</td>
                                                <td>Tea and Coffee</td>
                                                <td>1Bn</td>
                                                <td>Expensive Tea</td>
                                                <td>2Bn</td>
                                            </tr>
                                            <tr>
                                                <td>Some activity</td>
                                                <td>Dollar fund</td>
                                                <td>112399YT</td>
                                                <td>Tea and Coffee</td>
                                                <td>1Bn</td>
                                                <td>Expensive Tea</td>
                                                <td>2Bn</td>
                                            </tr>


                                        </tbody>
                                    </Table>

                                </div>

                            </>
                        )
                        : ''
                }

                {
                    keyTab === 11 && showTabs
                        ? (
                            <div className={styles.tabsPageContainer}>
                                <button
                                    type="button"
                                    onClick={handlePreviewBtn}
                                >
                                Download this page
                                </button>
                            PREVIEW PAGE
                                <ResponsiveContainer className={styles.chartContainer} height={300}>
                                    <LineChart
                                        margin={{ top: 0, right: 10, left: 10, bottom: 10 }}
                                        data={lineData}
                                    >
                                        <CartesianGrid
                                            vertical={false}
                                            strokeDasharray="3 3"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            interval="preserveStart"
                                            tick={{ fill: '#94bdcf' }}
                                        />
                                        <YAxis
                                            unit={'℃'}
                                            axisLine={false}
                                            domain={[0, 40]}
                                            padding={{ top: 20 }}
                                            tick={{ fill: '#94bdcf' }}
                                            tickCount={10}
                                            interval="preserveEnd"
                                            allowDataOverflow
                                        />
                                        <Line type="monotone" dataKey="AvgMax" stroke="#ffbf00" />
                                        <Line type="monotone" dataKey="DailyAvg" stroke="#00d725" />
                                        <Line type="monotone" dataKey="AvgMin" stroke="#347eff" />
                                    </LineChart>
                                </ResponsiveContainer>

                            </div>
                        ) : ''
                }
            </div>
        </>
    );
};

export default ReportModal;
