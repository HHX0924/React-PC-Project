import Bar from "@/components/Bar/inedx";


function Home () {

    return(
        <div>
          <Bar
              title='框架'
              xData={['react','vue','angular']}
              yData={[30,80,50]}
              style={{width:'500px',height:'400px'}}
          />
          <Bar />
        </div>
    )


}
export default Home