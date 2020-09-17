import React, { Fragment, useEffect } from 'react'
import classes from './Dashboard.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { ResponsiveContainer } from 'recharts'
import Spinner from '../../../homeComponents/UI/Spinner/Spinner'
import * as actions from '../../../store/actions/dashboard'
import IconWithTextCard from '../../../components/statusCard/IconWithTextCard'
import Grid from '@material-ui/core/Grid';
import LineChartMain from '../../../components/Chart/Charts/LineChartMain'
import CardBox from '../../../components/CardBox/index';
import Hidden from '@material-ui/core/Hidden';
import CustomLineChart from '../../../components/CustomLineChart/index'
import ChartCard from '../../../components/ChartCard/ChartCard'
import * as cards from '../../../JSONFiles/dashboardCards';
import DashbboardSkeleton from './DashboardSkeleton';

const Dashboard = (props) => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.getCurrentCards());
        dispatch(actions.getPlaces());
        dispatch(actions.getHealthposts())
    }, [dispatch])
    const date = new Date();
    const year = date.getFullYear();
    // console.log(year);
    const { cardData, loading, graphs } = useSelector(({ dashboard }) => dashboard);

    const card = cardData !== undefined && cardData !== null ? cards.data.map((data, index) => {
        return (
            <Grid item lg={3} md={3} xs={6} key={index}>
                <IconWithTextCard data={data} value={cardData[data.title]} style={{marginBottom: 0}}/>
            </Grid>
        )
    }) : null;
    return (
        <div className={classes.Dashboard}>
            
            <div className={classes.Content}>
                <div className={classes.View}>
                    
                {(loading || (cardData === undefined || cardData === null))?<DashbboardSkeleton />:
                        <Fragment>
                            <div style={{padding: '20px'}}>
                                <Grid container spacing={5} justify="center">
                                    {card}
                                </Grid>
                            </div>

                            <div>
                                <Grid container>
                                    <Grid item md={8} xs={12}>
                                        <CardBox heading="Sunsari District Hospital" styleName="col-12">
                                            {(loading || graphs === null || graphs.hospital === undefined || graphs.healthPosts === undefined)
                                                ? <Spinner /> : <LineChartMain data={graphs.hospital[year]} height={300} />}
                                        </CardBox>
                                    </Grid>
                                    <Hidden only="sm">
                                       
                                        {(loading || graphs === null || graphs.healthPosts === null)
                                            ? <Spinner /> : <Grid item md={4}>
                    
                                                {graphs.healthPosts.map((healthPost, index) => {
                                                    return <div className="col-12" key={index}>
                                                        {/* { console.log(Object.values(healthPost.data[year]))} */}
                                                        <ChartCard styleName="bg-gradient-primary text-white">
                                                            <div className="chart-title">
                                                                <h2 className="mb-1">{healthPost.name}</h2>
                                                                <p>Number of Deliveries</p>
                                                            </div>
                                                            <ResponsiveContainer width="100%" height={90}>
                                                                <CustomLineChart
                                                                    chartData={Object.values(healthPost.data[year])}
                                                                    labels={Object.keys(healthPost.data[year])}
                                                                    borderColor="#FFF"
                                                                    pointBorderColor="#FFF"
                                                                    pointBackgroundColor="#FF9800"
                                                                    pointBorderWidth={2}
                                                                    pointRadius={4}
                                                                    lineTension={0}
                                                                />
                                                            </ResponsiveContainer>
                                                        </ChartCard>
                                                    </div>
                                                })}

                                            </Grid>}
                                    </Hidden>
                                </Grid>
                            </div>
                        </Fragment>}
                </div>
            </div>}

        </div>
    )
}

export default (Dashboard)
