import { useState } from 'react';
import CommandsTableRow from '../components/CommandsTableRow';
import Hero from '../components/Hero';
import Layout from '../components/Layout';
import { fetchDiscordUserInfo } from '../utils/APIUtils';
import { robertifyAPI } from '../utils/RobertifyAPI';

function groupCommands(commands, max) {
    const arr = []
    
    let id = 0;
    for (let i = 0; i < commands.length; i += max) {
        const obj = { id: id++, rows: []}
        const chunk = commands.slice(i, i + max);
        obj.rows.push(chunk)

        arr.push(obj)
    }

    return arr;
}

export default function Commands({ commands, token, discordInfo }) {
    const commandsCpy = [...commands].sort((a,b) => a.name.localeCompare(b.name));
    const allCommandsParsed = commandsCpy.map(command => <CommandsTableRow key={command.id} id={command.id} name={command.name} description={command.description} category={command.category} />)    
    const commandsParsed = groupCommands(allCommandsParsed, 10)

    const [ tableInfo, setTableInfo ] = useState({
        pageItems: [...commandsParsed],
        selectedButton: 0,
        searchText: '',
        categoryValue: ''
    });

    const pageItems = tableInfo.pageItems;
    const selectedButton = tableInfo.selectedButton;
    const searchText = tableInfo.searchText;

    const setPageItems = (items) => {
        setTableInfo(oldInfo => ({
            ...oldInfo,
            pageItems: items
        }))
    };

    const setSelectedButton = (buttonID) => {
        setTableInfo(oldInfo => ({
            ...oldInfo,
            selectedButton: buttonID
        }))
    };

    const setSearchText = (text) => {
        setTableInfo(oldInfo => ({
            ...oldInfo,
            searchText: text
        }))
    };

    const handlePageChange = (newPage) => {
        setSelectedButton(newPage);
    };

    const updateSearchText = (event) => {
        const { name, value } = event.target;
        const pageItems = groupCommands(allCommandsParsed.filter(item => item.props.name.toLowerCase().startsWith(value.trim().toLowerCase())), 10);

        setTableInfo(({
            selectedButton: 0,
            pageItems: (!value) ? ([...commandsParsed]) : ((pageItems.length) ? ([...pageItems] ): ([{}])),
            [name]: value.trim(),
            categoryValue: ''
        }))
    };

    const updateSearchCategory = (event) => {
        const { value } = event.target;
        const pageItems = groupCommands(allCommandsParsed.filter(item => item.props.category.toLowerCase().startsWith(value.toLowerCase())), 10);

        setTableInfo(({
            selectedButton: 0,
            pageItems: (!value) ? ([...commandsParsed]) : ((pageItems.length) ? ([...pageItems] ): ([{}])),
            searchText: '',
            categoryValue: value
        }))
    };

    const pageButtons = pageItems.map(commandObj => commandObj.id || commandObj.id === 0 ? <button className={`command-page-btn${commandObj.id === selectedButton ? ' selected' : ''}`} onClick={() => handlePageChange(commandObj.id)}>{commandObj.id + 1}</button> : '');

    return (
        <Layout token={token} discordInfo={discordInfo} title='Robertify - Commands'>
            <Hero
                title='Commands'
                subTitle='So... many... commands...'
            />
            <main>
                <div className='commands--about'>
                    <div className='commands--about-images'>
                        <img src='https://i.robertify.me/images/hjw5n.png' alt='Favourite Tracks' />
                        <span />
                        <span />
                        <img src='https://i.robertify.me/images/jg8ua.png' alt='Themes' />
                    </div>
                    <div className='commands--about-desc'>
                        <h3 className='commands--about-desc-title'>Your capability is astounding</h3>
                        <p className='commands--about-desc-body'>There are so many commands and features that can truly maximize your satisfaction with Robertify. With over 50+ commands you are guaranteed an amazing user and listening experience. With Robust music commands such as volume control and favourite tracks working in tandem with slick features like Request Channels, you won’t feel like listening to music the way you used to on Discord before Robertify.</p>
                    </div>
                </div>
                <div className='commands'>
                    <div className='commands-filter-controllers'>
                        <select
                            id='categorySelector'
                            value={tableInfo.categoryValue}
                            onChange={updateSearchCategory}
                            name='categoryValue'
                        >
                            <option value=''>Select category</option>
                            <option value='management'>Management</option>
                            <option value='music'>Music</option>
                            <option value='misc'>Miscellaneous</option>
                            <option value='utility'>Utility</option>
                        </select>
                        <input type='text' name='searchText' placeholder='Search...' value={searchText} onChange={updateSearchText} />
                    </div>
                    <table className='commands_table'>
                        <thead>
                        <tr className='commands_table--row'>
                            <th className='commands_table--heading'>Command Name</th>
                            <th className='commands_table--heading'>Description</th>
                            <th className='commands_table--heading'>Category</th>
                        </tr>
                        </thead>
                        <tbody>
                            {pageItems[selectedButton] ? pageItems[selectedButton].rows : ''}
                        </tbody>
                    </table>   
                    <div className='commands-page-controllers'>
                        {pageButtons}
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export async function getServerSideProps({ req, res }) {
    await robertifyAPI.setAccessToken()
    
    let commands = [];
    try {
        commands = await robertifyAPI.getCommandInfo()
    } catch (ex) {
        console.log(ex);
    }
    const realProps = await fetchDiscordUserInfo(req);
    
    return {
        props: {
            commands: commands,
            token: realProps.props.token,
            discordInfo: realProps.props.discordInfo
        }
    }
}