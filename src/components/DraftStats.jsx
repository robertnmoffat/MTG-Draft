import { PieChart } from "react-minimal-pie-chart";

function DraftStats(properties){
    return <div id="card-space" className="body-text">
                <h2>Draft Complete</h2>                
                <p className="stat-text">White:{properties.pickStats.W} {Math.round((properties.pickStats.W / 42) * 100)}% Blue:{properties.pickStats.U} {Math.round((properties.pickStats.U / 42) * 100)}% Black:{properties.pickStats.B} {Math.round((properties.pickStats.B / 42) * 100)}% Red:{properties.pickStats.R} {Math.round((properties.pickStats.R / 42) * 100)}% Green:{properties.pickStats.G} {Math.round((properties.pickStats.G / 42) * 100)}%</p>
                <div className="pie-chart">
                    <PieChart
                        labelStyle={{ fontSize: '35%' }}
                        label={({ dataEntry }) => {
                            let percent = Math.round(dataEntry.percentage);
                            if (percent != 0)
                                return `${percent} %`
                            else
                                return '';
                        }}
                        data={[
                            { title: 'White', value: properties.pickStats.W, color: "White" },
                            { title: 'Blue', value: properties.pickStats.U, color: 'Blue' },
                            { title: 'Black', value: properties.pickStats.B, color: '#353535' },
                            { title: 'Red', value: properties.pickStats.R, color: 'Red' },
                            { title: 'Green', value: properties.pickStats.G, color: 'Green' },
                        ]}
                    />
                </div>
                <div className="pie-chart">
                    <PieChart
                        labelStyle={{ fontSize: '35%' }}
                        label={({ dataEntry }) => {
                            let percent = Math.round(dataEntry.percentage);
                            if (percent != 0)
                                if (percent >= 15)
                                    return '' + dataEntry.title + '\n' + percent + '%'
                                else
                                    return `${percent} %`
                            else
                                return '';
                        }}
                        data={[
                            { title: 'Creature', value: properties.pickStats.types.Creature, color: "#533483" },
                            { title: 'Instant', value: properties.pickStats.types.Instant, color: '#E94560' },
                            { title: 'Sorcery', value: properties.pickStats.types.Sorcery, color: '#9E3D72' },
                            { title: 'Artifact', value: properties.pickStats.types.Artifact, color: '#6E44AC' },
                            { title: 'Planeswalker', value: properties.pickStats.types.Planeswalker, color: '#FF5B7E' },
                            { title: 'Land', value: properties.pickStats.types.Land, color: '#79397B' },
                            { title: 'Enchantment', value: properties.pickStats.types.Enchantment, color: '#723145' }
                        ]}
                    />
                </div>
                <p className="stat-text">{JSON.stringify(properties.pickStats.types, null, 1).replace('{', "").replace(/"/g, "").replace("\"", "").replace("}", "")}</p>
            </div>
}

export default DraftStats;