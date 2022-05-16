import Layout from "../../../components/Layout";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchAllDiscordUserInfo, fetchDiscordGuildInfo } from '../../../utils/APIUtils';
import Link from 'next/link';
import Toggle from "../../../components/Toggle";
import SelectMenu from "../../../components/SelectMenu";
import TextOptionList from "../../../components/TextOptionList";
import { robertifyAPI } from "../../../utils/RobertifyAPI";
import axios from "axios";

function sortChannelsByCategory(categories, channels) {
    if (!categories) return null;
    if (!channels) return null;

    const channelsSorted = categories.map(categoryObj => {
        const channelArr = channels.filter(channelObj => channelObj.parent_id === categoryObj.id);
        if (!channelArr.length)
            return;
        return {
            [categoryObj.id]: { channels: [...channels.filter(channelObj => channelObj.parent_id === categoryObj.id)], category_name: categoryObj.name }
        }   
    }).filter(obj => obj);
    const channelsWithoutCategory = channels.filter(channelObj => !channelObj.parent_id);
    if (channelsWithoutCategory.length)
        channelsSorted.push({ noCategory: { channels: [...channelsWithoutCategory], category_name: 'No Category'} })
    return channelsSorted;
}

function getOriginalDataObject(dbGuildInfo, fullGuildInfo) {
    if (!dbGuildInfo) return null;
    if (!fullGuildInfo) return null;

    function getRoleByID(id) {
        return fullGuildInfo.roles.filter(roleObj => roleObj.id === id)[0];
    }

    function getTextChannelByID(id) {
        try {
            const channelObj = textChannelsSorted.filter(obj => obj[Object.keys(obj)[0]].channels.filter(channelObj => channelObj.id === id)[0])[0];
            channelObj[Object.keys(channelObj)[0]].channels = channelObj[Object.keys(channelObj)[0]].channels.filter(channelObj => channelObj.id === id);
            return channelObj[Object.keys(channelObj)[0]].channels[0];
        } catch (ex) {
            return {};
        }
    }

    // DJ Roles Obj
    const djRoles = dbGuildInfo.permissions['1'].map(roleID => {
        try {
            const roleObj = getRoleByID(roleID)
            return ({
                name: roleObj.name,
                id: roleObj.id,
                icon: <div className="circle" style={{ backgroundColor: `#${parseInt(roleObj.color || 10592673, 10).toString(16).padStart(6, '0')}`, width: '1rem', height: '1rem' }}></div> 
            })
        } catch (ex) {
            return {};
        }
    });
    //

    // Channels
    const categories = fullGuildInfo.channels ? fullGuildInfo.channels.filter(channelObj => channelObj.type === 4) : [];
    const textChannels = fullGuildInfo.channels ? fullGuildInfo.channels.filter(channelObj => channelObj.type === 0) : [];
    const voiceChannels = fullGuildInfo.channels ? fullGuildInfo.channels.filter(channelObj => channelObj.type === 2) : [];
    const textChannelsSorted = sortChannelsByCategory(categories, textChannels);
    const voiceChannelsSorted = sortChannelsByCategory(categories, voiceChannels);

    // Restricted Voice Channels Obj
    let restrictedVoiceChannels;
    try {
        restrictedVoiceChannels = dbGuildInfo.restricted_channels.voice_channels.map(channelID => {
            return voiceChannelsSorted.map(categoryObj => {
                const channelsArr = categoryObj[Object.keys(categoryObj)[0]].channels;
                return channelsArr.filter(channelObj => channelObj.id === channelID);
            })
        }).map(arr => arr.filter(innerArr => innerArr.length)).map(([[ arr ]]) => arr);
    } catch (ex) {
        restrictedVoiceChannels = [];
    }
    //

    // Restricted Text Channels Obj
    let restrictedTextChannels;
    try {
        restrictedTextChannels = dbGuildInfo.restricted_channels.text_channels.map(channelID => {
            return textChannelsSorted.map(categoryObj => {
                const channelsArr = categoryObj[Object.keys(categoryObj)[0]].channels;
                return channelsArr.filter(channelObj => channelObj.id === channelID);
            })
        }).map(arr => arr.filter(innerArr => innerArr.length)).map(([[ arr ]]) => arr);
    } catch (ex) {
        restrictedTextChannels = [];
    }
    //

    // Log Channel Obj
    const logChannelObj = getTextChannelByID(dbGuildInfo.log_channel);
    //

    // Themes
    let themeObj;
    switch(dbGuildInfo.theme.toLowerCase()) {
        case 'green': {
            themeObj = {
                id: 'ROBERTIFY_THEME_GREEN',
                name: 'Green',
                icon: <div className="circle" style={{ backgroundColor: `#00ff1e`, width: '1rem', height: '1rem' }}></div> 
            }
            break;
        }
        case 'gold': {
            themeObj = {
                id: 'ROBERTIFY_THEME_GOLD',
                name: 'Gold',
                icon: <div className="circle" style={{ backgroundColor: `#ffa600`, width: '1rem', height: '1rem' }}></div> 
            }
            break;
        }
        case 'red': {
            themeObj = {
                id: 'ROBERTIFY_THEME_RED',
                name: 'Red',
                icon: <div className="circle" style={{ backgroundColor: `#ff0000`, width: '1rem', height: '1rem' }}></div> 
            }
            break;
        }
        case 'pink': {
            themeObj = {
                id: 'ROBERTIFY_THEME_PINK',
                name: 'Pink',
                icon: <div className="circle" style={{ backgroundColor: `#ff00ee`, width: '1rem', height: '1rem' }}></div> 
            }
            break;
        }
        case 'purple': {
            themeObj = {
                id: 'ROBERTIFY_THEME_PURPLE',
                name: 'Purple',
                icon: <div className="circle" style={{ backgroundColor: `#8000ff`, width: '1rem', height: '1rem' }}></div> 
            }
            break;
        }
        case 'blue': {
            themeObj = {
                id: 'ROBERTIFY_THEME_BLUE',
                name: 'Blue',
                icon: <div className="circle" style={{ backgroundColor: `#0077ff`, width: '1rem', height: '1rem' }}></div> 
            }
            break;
        }
        case 'light_blue': {
            themeObj = {
                id: 'ROBERTIFY_THEME_LIGHT_BLUE',
                name: 'Light Blue',
                icon: <div className="circle" style={{ backgroundColor: `#00e1ff`, width: '1rem', height: '1rem' }}></div> 
            }
            break;
        }
        case 'orange': {
            themeObj = {
                id: 'ROBERTIFY_THEME_ORANGE',
                name: 'Orange',
                icon: <div className="circle" style={{ backgroundColor: `#ff4d00`, width: '1rem', height: '1rem' }}></div> 
            }
            break;
        }
        case 'yellow': {
            themeObj = {
                id: 'ROBERTIFY_THEME_YELLOW',
                name: 'Yellow',
                icon: <div className="circle" style={{ backgroundColor: `#ffea00`, width: '1rem', height: '1rem' }}></div> 
            }
            break;
        }
        case 'dark': {
            themeObj = {
                id: 'ROBERTIFY_THEME_DARK',
                name: 'Dark',
                icon: <div className="circle" style={{ backgroundColor: `#000000`, width: '1rem', height: '1rem' }}></div> 
            }
            break;
        }
        case 'light': {
            themeObj = {
                id: 'ROBERTIFY_THEME_Light',
                name: 'Light',
                icon: <div className="circle" style={{ backgroundColor: `#ffffff`, width: '1rem', height: '1rem' }}></div> 
            }
            break;
        }
        default: throw new Error('Invalid Robertify theme passed. Got ' + dbGuildInfo.theme);
    }
    //

    return {
        djRoles: [...djRoles.filter(roleObj => Object.keys(roleObj).length)],
        restricted_text_channels: [...restrictedTextChannels],
        restricted_voice_channels: [...restrictedVoiceChannels],
        log_channel: {...logChannelObj},
        theme: {...themeObj},
        toggles: {...dbGuildInfo.toggles},
        eight_ball: [...dbGuildInfo.eight_ball]
    }
}

function getDefaultGuildInfo(fullGuildInfo) {
    const defaultObj = {
        toggles: {
            restricted_voice_channels: false,
            restricted_text_channels: false,
            '8ball': true,
            show_requester: true,
            announce_messages: true,
            polls: true,
            tips: true,
            vote_skips: false,
            "dj_toggles": {
                "247": false,
                "play": false,
                "disconnect": false,
                "favouritetracks": false,
                "skip": false,
                "seek": false,
                "remove": false,
                "karaoke": false,
                "tremolo": false,
                "search": false,
                "loop": false,
                "nightcore": false,
                "join": false,
                "lyrics": false,
                "jump": false,
                "vibrato": false,
                "resume": false,
                "move": false,
                "nowplaying": false,
                "previous": false,
                "clear": false,
                "skipto": false,
                "8d": false,
                "pause": false,
                "autoplay": false,
                "volume": false,
                "lofi": false,
                "rewind": false,
                "stop": false,
                "shuffleplay": false,
                "shuffle": false,
                "queue": false
            },
            "log_toggles": {
                "queue_add": true,
                "track_move": true,
                "track_loop": true,
                "player_pause": true,
                "track_vote_skip": true,
                "queue_shuffle": true,
                "player_resume": true,
                "volume_change": true,
                "track_seek": true,
                "track_previous": true,
                "track_skip": true,
                "track_rewind": true,
                "bot_disconnected": true,
                "queue_remove": true,
                "filter_toggle": true,
                "player_stop": true,
                "queue_loop": true,
                "queue_clear": true,
                "track_jump": true
            }
        },
        eight_ball : [],
        theme: 'green',
        permissions: {
            '0': [],
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            users: {}
        },
        restricted_channels: {
            voice_channels: [],
            text_channels: []
        },
        log_channel: '-1',
        theme: 'green'
    }

    return getOriginalDataObject(defaultObj, fullGuildInfo);
}

function compare(object1, object2) {
    if (!object1)
        return false;
    if (!object2)
        return false;

    for (let propName in object1) {
        if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        } else if (typeof object1[propName] != typeof object2[propName]) {
            return false;
        }
    }

    for(let propName in object2) { 
        if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        } else if (typeof object1[propName] != typeof object2[propName]) {
            return false;
        }

        if(!object1.hasOwnProperty(propName))
          continue;

        if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
           if (!arrayCompare(object1[propName], object2[propName]))
                        return false;
        }

        else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
           if (!compare(object1[propName], object2[propName]))
                        return false;
        }

        else if(object1[propName] != object2[propName]) {
           return false;
        }
    }
    return true;
}

function arrayCompare(arr1, arr2) {
    if (!arr1)
        return false;
    if (!arr2)
        return false;

    if (!arr1 instanceof Array || !arr2 instanceof Array )
        throw new TypeError();

    if (arr1.length != arr2.length)
        return false;

    for (var i = 0, l=arr1.length; i < l; i++) {
        if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
            if (!arrayCompare(arr1[i], arr2[i]))
                return false;       
        } else if (arr1[i] instanceof Object && arr2[i] instanceof Object) {
            if (!compare(arr1[i], arr2[i]))
                return false;
        } else if (arr1[i] != arr2[i]) {
            return false;   
        }           
    }       
    return true;
}

export default function GuildPage({ token, userInfo, guildInfo,
    dbGuildInfo, fullGuildInfo, hasAccess,
    localHostName, hostedHostName, hostedMasterPassword, botID
}) {
    const router = useRouter();

    useEffect(() => {
        if (!hasAccess)
            router.push(`https://discord.com/oauth2/authorize?client_id=${botID}&permissions=524023090512&redirect_uri=${encodeURI(`${localHostName}/callback/discord/guild/invite`)}&response_type=code&scope=identify%20guilds%20bot&guild_id=${guildInfo.id}&disable_guild_select=true`)
    }, []);

    const [ discordInfoState ] = useState({
        userInfo: userInfo,
        guildInfo: guildInfo
    }, []);
    const guild = discordInfoState.guildInfo;

    const [ isRefreshing, setIsRefreshing ] = useState(false);

    useEffect(() => {
        setIsRefreshing(false);
        setOriginalData(getOriginalDataObject(dbGuildInfo, fullGuildInfo));
    }, [token, userInfo, guildInfo, dbGuildInfo, fullGuildInfo, hasAccess, localHostName])

    useEffect(() => {
        if (!hasAccess)
            return;
        if (isRefreshing)
            return;

        setTogglesState(originalData.toggles);
        setEightBallResponses(originalData.eight_ball);
        setDjSelectObj({
            optionsVisible: false,
            selectValues: [...originalData.djRoles],
            shownOptions: [...roleNamesSorted],
            searchText: ''
        });
        setVcSelectObj({
            optionsVisible: false,
            selectValues: [...originalData.restricted_voice_channels],
            shownOptions: [...voiceChannelsSorted],
            searchText: ''
        });
        setTcSelectObj({
            optionsVisible: false,
            selectValues: [...originalData.restricted_text_channels],
            shownOptions: [...textChannelsSorted],
            searchText: ''
        });
        setLcSelectObj({
            optionsVisible: false,
            selectValues: Object.keys(originalData.log_channel).length ? [originalData.log_channel] : [],
            shownOptions: [...textChannelsSorted],
            searchText: ''
        });
        setThemeSelectObj({
            optionsVisible: false,
            selectValues: [{...originalData.theme}],
            shownOptions: [...themes],
            searchText: ''
        });
    }, [isRefreshing]);

    useEffect(() => {
        if (!discordInfoState.userInfo) {
            router.push('/');
            return;
        }

        if (!discordInfoState.guildInfo) {
            router.push('/');
            return;
        }

        if (!dbGuildInfo) {
            router.push(`https://discord.com/oauth2/authorize?client_id=${botID}&permissions=524023090512&redirect_uri=${encodeURI(`${localHostName}/callback/discord/guild/invite`)}&response_type=code&scope=identify%20guilds%20bot&guild_id=${guildInfo.id}&disable_guild_select=true`)
            return;
        }

        if (!fullGuildInfo) {
            router.push('/dashboard');
            return;
        }
    }, [discordInfoState]);

    const categories = fullGuildInfo ? fullGuildInfo.channels.filter(channelObj => channelObj.type === 4) : null;
    const textChannels = fullGuildInfo ? fullGuildInfo.channels.filter(channelObj => channelObj.type === 0) : null;
    const voiceChannels = fullGuildInfo ? fullGuildInfo.channels.filter(channelObj => channelObj.type === 2) : null;
    
    const themes = [
        {
            id: 'ROBERTIFY_THEME_GREEN',
            name: 'Green',
            icon: <div className="circle" style={{ backgroundColor: `#00ff1e`, width: '1rem', height: '1rem' }}></div> 
        },
        {
            id: 'ROBERTIFY_THEME_GOLD',
            name: 'Gold',
            icon: <div className="circle" style={{ backgroundColor: `#ffa600`, width: '1rem', height: '1rem' }}></div> 
        },
        {
            id: 'ROBERTIFY_THEME_RED',
            name: 'Red',
            icon: <div className="circle" style={{ backgroundColor: `#ff0000`, width: '1rem', height: '1rem' }}></div> 
        },
        {
            id: 'ROBERTIFY_THEME_PINK',
            name: 'Pink',
            icon: <div className="circle" style={{ backgroundColor: `#ff00ee`, width: '1rem', height: '1rem' }}></div> 
        },
        {
            id: 'ROBERTIFY_THEME_PURPLE',
            name: 'Purple',
            icon: <div className="circle" style={{ backgroundColor: `#8000ff`, width: '1rem', height: '1rem' }}></div> 
        },
        {
            id: 'ROBERTIFY_THEME_BLUE',
            name: 'Blue',
            icon: <div className="circle" style={{ backgroundColor: `#0077ff`, width: '1rem', height: '1rem' }}></div> 
        },
        {
            id: 'ROBERTIFY_THEME_LIGHT_BLUE',
            name: 'Light Blue',
            icon: <div className="circle" style={{ backgroundColor: `#00e1ff`, width: '1rem', height: '1rem' }}></div> 
        },
        {
            id: 'ROBERTIFY_THEME_ORANGE',
            name: 'Orange',
            icon: <div className="circle" style={{ backgroundColor: `#ff4d00`, width: '1rem', height: '1rem' }}></div> 
        },
        {
            id: 'ROBERTIFY_THEME_YELLOW',
            name: 'Yellow',
            icon: <div className="circle" style={{ backgroundColor: `#ffea00`, width: '1rem', height: '1rem' }}></div> 
        },
        {
            id: 'ROBERTIFY_THEME_DARK',
            name: 'Dark',
            icon: <div className="circle" style={{ backgroundColor: `#000000`, width: '1rem', height: '1rem' }}></div> 
        },
        {
            id: 'ROBERTIFY_THEME_Light',
            name: 'Light',
            icon: <div className="circle" style={{ backgroundColor: `#ffffff`, width: '1rem', height: '1rem' }}></div> 
        }
    ]

    const roleNamesSorted = fullGuildInfo ? fullGuildInfo.roles.map(roleObj => (
        {
            name: roleObj.name,
            id: roleObj.id,
            icon: <div className="circle" style={{ backgroundColor: `#${parseInt(roleObj.color || 10592673, 10).toString(16).padStart(6, '0')}`, width: '1rem', height: '1rem' }}></div> 
        }
    )).sort((a, b) => a.name.localeCompare(b.name)) : null;

    const textChannelsSorted = sortChannelsByCategory(categories, textChannels);
    const voiceChannelsSorted = sortChannelsByCategory(categories, voiceChannels);

    let hasPerms = guildInfo.owner ? false : (Number(guildInfo.permissions) & (1 << 5)) === (1 << 5);
    hasPerms ||= (Number(guildInfo.permissions) & (1 << 3)) == (1 << 3);
    hasPerms = !Number(guildInfo.permissions) ? false : hasPerms;
    
    const [ originalData, setOriginalData ] = useState(getOriginalDataObject(dbGuildInfo, fullGuildInfo));
    const [ changeMade, setChangeMade ] = useState(false);
    const [ togglesState, setTogglesState ] = useState(originalData ? originalData.toggles : null);
    
    const toggleState = (stateName) => {
        if (!hasPerms) return;

        setTogglesState(oldState => {
            const newState = {
                ...oldState,
                [stateName]: !oldState[stateName]
            };  
            
            setChangeMade(!compareAllStates(
                djSelectObj.selectValues, vcSelectObj.selectValues,
                tcSelectObj.selectValues, lcSelectObj.selectValues[0],
                themeSelectObj.selectValues[0], newState
            ))
            return newState;
        });
    }

    const toggleInnerState = (objectName, stateName) => {
        if (!hasPerms) return;

        setTogglesState(oldState => {
            const newState ={
                ...oldState,
                [objectName]: {
                    ...oldState[objectName],
                    [stateName]: !oldState[objectName][stateName]
                }
            }

            if (!compare(originalData.toggles, newState)) {
                setChangeMade(true);
            } else if (changeMade && compare(originalData.toggles, newState)) {
                setChangeMade(false);
            }

            return newState;
        });
    }

    const [ djSelectObj, setDjSelectObj ] = useState({
        optionsVisible: false,
        selectValues: originalData ? [...originalData.djRoles] : [],
        shownOptions: roleNamesSorted ? [...roleNamesSorted] : [],
        searchText: ''
    });

    const toggleDjOptionsVisible = () => {
        if (!hasPerms) return;

        setDjSelectObj(oldObj => ({
            ...oldObj,
            optionsVisible: !oldObj.optionsVisible
        }));
    }

    const updateDjSelectValues = (isActive, value) => {
        updateMenuSelectedValuesByID(isActive, setDjSelectObj, value, true, true, (newObj) => {
            setChangeMade(!compareAllStates(
                newObj.selectValues, vcSelectObj.selectValues,
                tcSelectObj.selectValues, lcSelectObj.selectValues[0],
                themeSelectObj.selectValues[0], togglesState
            ))});
    }

    const updateDjSearchText = (value) => {
        if (!hasPerms) return;

        setDjSelectObj(oldObj => ({
            ...oldObj,
            searchText: value,
            shownOptions: roleNamesSorted.filter(val => val.toLowerCase().includes(value.toLowerCase()))
        }));
    }

    const [ vcSelectObj, setVcSelectObj ] = useState({
        optionsVisible: false,
        selectValues: originalData ? [...originalData.restricted_voice_channels] : [],
        shownOptions: voiceChannelsSorted ? [...voiceChannelsSorted] : [],
        searchText: ''
    });

    const toggleVcOptionsVisible = () => {
        toggleMenuVisibility(setVcSelectObj);
    }

    const updateVcSelectValues = (isActive, value) => {
        updateMenuSelectedValues(isActive, setVcSelectObj, value, true, true, (newObj) => {
            setChangeMade(!compareAllStates(
                djSelectObj.selectValues, newObj.selectValues,
                tcSelectObj.selectValues, lcSelectObj.selectValues[0],
                themeSelectObj.selectValues[0], togglesState
            ))});
    }

    const updateVcSearchText = (value) => {
        updateMenuChannelSearchText(voiceChannelsSorted, setVcSelectObj, value);
    }

    const [ tcSelectObj, setTcSelectObj ] = useState({
        optionsVisible: false,
        selectValues: originalData ? [...originalData.restricted_text_channels] : [],
        shownOptions: textChannelsSorted ? [...textChannelsSorted] : [],
        searchText: ''
    });

    const toggleTcOptionsVisible = () => {
        toggleMenuVisibility(setTcSelectObj);
    }

    const updateTcSelectValues = (isActive, value) => {
        updateMenuSelectedValues(isActive, setTcSelectObj, value, true, true, (newObj) => {
            setChangeMade(!compareAllStates(
                djSelectObj.selectValues, vcSelectObj.selectValues,
                newObj.selectValues, lcSelectObj.selectValues[0],
                themeSelectObj.selectValues[0], togglesState
            ))});
    }

    const updateTcSearchText = (value) => {
        updateMenuChannelSearchText(textChannelsSorted, setTcSelectObj, value);
    }

    const [ lcSelectObj, setLcSelectObj ] = useState({
        optionsVisible: false,
        selectValues: originalData ? Object.keys(originalData.log_channel).length ? [originalData.log_channel] : [] : [],
        shownOptions: textChannelsSorted ? [...textChannelsSorted] : [],
        searchText: ''
    });

    const toggleLcOptionsVisible = () => {
        toggleMenuVisibility(setLcSelectObj);
    }

    const updateLcSelectValues = (isActive, value) => {
        updateMenuSelectedValuesByID(isActive, setLcSelectObj, value, false, true, (newObj) => {
            setChangeMade(!compareAllStates(
                djSelectObj.selectValues, vcSelectObj.selectValues,
                tcSelectObj.selectValues, newObj.selectValues[0],
                themeSelectObj.selectValues[0], togglesState
            ))});
    }

    const updateLcSearchText = (value) => {
        updateMenuChannelSearchText(textChannelsSorted, setLcSelectObj, value);
    }

    const [ themeSelectObj, setThemeSelectObj ] = useState({
        optionsVisible: false,
        selectValues: originalData ? [{...originalData.theme}] : [{}],
        shownOptions: themes ? [...themes] : [],
        searchText: ''
    })

    const toggleThemeOptionsVisible = () => {
        toggleMenuVisibility(setThemeSelectObj);
    }

    const updateThemeSelectValues = (isActive, value) => {
        updateMenuSelectedValues(isActive, setThemeSelectObj, value, false, false, (newObj) => {
            setChangeMade(!compareAllStates(
                djSelectObj.selectValues, vcSelectObj.selectValues,
                tcSelectObj.selectValues, lcSelectObj.selectValues[0],
                newObj.selectValues[0], togglesState
            ))});
    }

    const updateThemeSearchText = (value) => {
        if (!hasPerms) return;

        setThemeSelectObj(oldObj => ({
            ...oldObj,
            searchText: value,
            shownOptions: themes.filter(val => val.name.toLowerCase().includes(value.toLowerCase()))
        }))
    }

    const toggleMenuVisibility = (setterFunction) => {
        if (!hasPerms) return;

        setterFunction(oldObj => ({
            ...oldObj,
            optionsVisible: !oldObj.optionsVisible
        }));
    }

    const updateMenuSelectedValues = (isActive, setterFunction, value,
        multiSelect = false, enableDeselect = true, changeCheck = function(newObj) {}
    ) => {
        if (!hasPerms) return;
        if (!isActive) return;

        setterFunction(oldObj => {
            const newItem = {
                ...oldObj,
                selectValues: multiSelect ? ((oldObj.selectValues.includes(value)) ? ([...oldObj.selectValues.filter(val => value !== val)]): ([...oldObj.selectValues, value])) : (enableDeselect ? ((oldObj.selectValues.includes(value)) ? ([]) : ([value])) : ([value]))
            }

            changeCheck(newItem);

            return newItem;
        });
    }

    const updateMenuSelectedValuesByID = (isActive, setterFunction, value,
        multiSelect = false, enableDeselect = true, changeCheck = function() {}
    ) => {
        if (!hasPerms) return;
        if (!isActive) return;

        setterFunction(oldObj => {
            const newItem = {
                ...oldObj,
                selectValues: multiSelect ? ((oldObj.selectValues.some(obj => obj.id == value.id)) ? ([...oldObj.selectValues.filter(val => value.id !== val.id)]): ([...oldObj.selectValues, value])) : (enableDeselect ? ((oldObj.selectValues.some(obj => obj.id == value.id)) ? ([]) : ([value])) : ([value]))
            }

            changeCheck(newItem);

            return newItem;
        });
    }

    const updateMenuChannelSearchText = (dataList, setterFunction, value) => {
        if (!hasPerms) return;

        const newItems = dataList.map(categoryObj => {
            const catObj = categoryObj[Object.keys(categoryObj)[0]];
            const channelsArr = categoryObj[Object.keys(categoryObj)[0]].channels;
            const channelsArrFiltered = channelsArr.filter(channelObj => channelObj.name.toLowerCase().includes(value.toLowerCase()));

            if (channelsArrFiltered) {
                if (channelsArrFiltered.length)
                    return { 
                        [Object.keys(categoryObj)[0]]: {
                            channels: channelsArrFiltered,
                            category_name:  catObj.category_name 
                        }
                    }
            }
            return null;
        }).filter(obj => obj);

        setterFunction(oldObj => ({
                ...oldObj,
                searchText: value,
                shownOptions: [...newItems]
        }))
    }

    const [ eightBallResponses, setEightBallResponses ] = useState(originalData ? originalData.eight_ball : []);
    const [ eightBallInput, setEightBallInput ] = useState('');

    const addEightBallResponse = (response) => {
        setEightBallResponses(oldResponses => {
            const newItem = [...oldResponses, response]

            setChangeMade(!compareAllStates(
                djSelectObj.selectValues, vcSelectObj.selectValues,
                tcSelectObj.selectValues, lcSelectObj.selectValues[0],
                themeSelectObj.selectValues[0], togglesState, newItem
            ))

            return newItem;
        });
        setEightBallInput('');
    }

    const removeEightBallResponse = (response) => {
        setEightBallResponses(oldResponses => {
            const newItem = [...oldResponses.filter(oldResponse => oldResponse != response)]

            setChangeMade(!compareAllStates(
                djSelectObj.selectValues, vcSelectObj.selectValues,
                tcSelectObj.selectValues, lcSelectObj.selectValues[0],
                themeSelectObj.selectValues[0], togglesState, newItem
            ))

            return newItem;
        })
    }

    const compareAllStates = (djRolesSelected, rvcSelected, rtcSelected,
        logChannelSelected, themeSelected, togglesState, eightBallState = eightBallResponses
    ) => {
        if (!arrayCompare(originalData.djRoles.map(obj => ({ name: obj.name, id: obj.id })), djRolesSelected.map(obj => ({ name: obj.name, id: obj.id })))) {
            return false;
        }
        
        if (!arrayCompare(originalData.restricted_text_channels.sort((a,b) => a.id.localeCompare(b.id)), rtcSelected.sort((a,b) => a.id.localeCompare(b.id)))) {
            return false;
        }
        
        if (!arrayCompare(originalData.restricted_voice_channels.sort((a,b) => a.id.localeCompare(b.id)), rvcSelected.sort((a,b) => a.id.localeCompare(b.id)))) {
            return false;
        }
        
        if (!compare(originalData.log_channel, logChannelSelected)) {
            return false;
        }
        
        if (themeSelected.name !== originalData.theme.name) {
            return false;
        }
        
        if (!compare(originalData.toggles, togglesState)) {
            return false;
        }
        
        if (!arrayCompare(originalData.eight_ball.sort((a,b) => a.localeCompare(b)), eightBallState.sort((a,b) => a.localeCompare(b)))) {
            return false;
        }

        return true;
    }

    const guildIcon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${guild.icon.startsWith('a_') ? 'gif' : 'png'}?size=512` : 'https://i.robertify.me/images/rykx6.png';

    const [ refreshAllowed,  setRefreshAllowed ] = useState(true);

    const refresh = () => {
        if (!hasPerms) return;
        if (!refreshAllowed) return;
        router.replace(router.asPath);

        setRefreshAllowed(false);
        setTimeout(() => setRefreshAllowed(true), 20 * 1000);

        setIsRefreshing(true)
    }

    const discard = () => {
        if (!hasPerms) return;
        if (!changeMade) return;

        setDjSelectObj({
            optionsVisible: false,
            selectValues: [...originalData.djRoles],
            shownOptions: [...roleNamesSorted],
            searchText: ''
        });

        setVcSelectObj({
            optionsVisible: false,
            selectValues: [...originalData.restricted_voice_channels],
            shownOptions: [...voiceChannelsSorted],
            searchText: ''
        });

        setTcSelectObj({
            optionsVisible: false,
            selectValues: [...originalData.restricted_text_channels],
            shownOptions: [...textChannelsSorted],
            searchText: ''
        });

        setLcSelectObj({
            optionsVisible: false,
            selectValues: Object.keys(originalData.log_channel).length ? [originalData.log_channel] : [],
            shownOptions: [...textChannelsSorted],
            searchText: ''
        });

        setThemeSelectObj({
            optionsVisible: false,
            selectValues: [{...originalData.theme}],
            shownOptions: [...themes],
            searchText: ''
        });

        setTogglesState(originalData.toggles);

        setEightBallResponses(originalData.eight_ball);
        setEightBallInput('');
        setChangeMade(false);
    }

    const reset = () => {
        if (!hasPerms) return;

        const defaultObj = getDefaultGuildInfo(fullGuildInfo);

        setDjSelectObj({
            optionsVisible: false,
            selectValues: [...defaultObj.djRoles],
            shownOptions: [...roleNamesSorted],
            searchText: ''
        });

        setVcSelectObj({
            optionsVisible: false,
            selectValues: [...defaultObj.restricted_voice_channels],
            shownOptions: [...voiceChannelsSorted],
            searchText: ''
        });

        setTcSelectObj({
            optionsVisible: false,
            selectValues: [...defaultObj.restricted_text_channels],
            shownOptions: [...textChannelsSorted],
            searchText: ''
        });

        setLcSelectObj({
            optionsVisible: false,
            selectValues: Object.keys(defaultObj.log_channel).length ? [defaultObj.log_channel] : [],
            shownOptions: [...textChannelsSorted],
            searchText: ''
        });

        setThemeSelectObj({
            optionsVisible: false,
            selectValues: [{...defaultObj.theme}],
            shownOptions: [...themes],
            searchText: ''
        });

        setTogglesState(defaultObj.toggles);

        setEightBallResponses(defaultObj.eight_ball);
        setChangeMade(true);
    }

    const [ doSave, setDoSaveState ] = useState(false);

    useEffect(() => {
        if (doSave) {
            robertifyAPI.setAccessTokenWithParams(hostedHostName, hostedMasterPassword)
                .then(accessToken => robertifyAPI.updateGuildInfo(hostedHostName, accessToken, dbGuildInfo.server_id, {
                    toggles: togglesState,
                    eight_ball: eightBallResponses,
                    theme: themeSelectObj.selectValues[0].name.toLowerCase(),
                    log_channel: lcSelectObj.selectValues[0] ? lcSelectObj.selectValues[0] : '-1',
                    restricted_channels: {
                        text_channels: tcSelectObj.selectValues.map(obj => obj.id),
                        voice_channels: vcSelectObj.selectValues.map(obj => obj.id)
                    },
                    permissions: {
                        ...dbGuildInfo.permissions,
                        '1': djSelectObj.selectValues.map(obj => obj.id)
                    }
                }))
                .then(setDoSaveState(false))
                .catch(err => console.log(err));
        }
    }, [doSave])

    const save = () => {
        if (!hasPerms) return;
        if (!changeMade) return;

        setOriginalData({
            djRoles: [...djSelectObj.selectValues],
            restricted_text_channels: [...tcSelectObj.selectValues],
            restricted_voice_channels: [...vcSelectObj.selectValues],
            log_channel: {...lcSelectObj.selectValues.at(0)},
            theme: {...themeSelectObj.selectValues.at(0)},
            toggles: {...togglesState},
            eight_ball: [...eightBallResponses]
        });
        setChangeMade(false);
        setDoSaveState(true);
    }
    
    const logToggles = togglesState ? Object.keys(togglesState.log_toggles).map(key => <Toggle key={key} label={key.replaceAll('_', ' ')} isActive={togglesState.log_toggles[key]} setActive={() => toggleInnerState('log_toggles', key)} />) : null;
    const djToggles = togglesState ? Object.keys(togglesState.dj_toggles).map(key => <Toggle key={key} label={key.replaceAll('_', ' ')} isActive={togglesState.dj_toggles[key]} setActive={() => toggleInnerState('dj_toggles', key)} />) : null;

    if (!hasAccess) return <div></div>

    return (
        <Layout token={token} discordInfo={discordInfoState.userInfo} title={`Robertify - ${guild.name}`} >
            <main className='serverDash'>
                <div className='serverDash--optionsContainer'>
                    <Link className='serverDash--backLink' href='/dashboard'>Go back to your servers</Link>
                    <div className='serverDash--guildBanner'>
                        <img src={guildIcon} alt='Guild Icon'></img>
                        <h1>{guild.name}</h1>
                    </div>
                    <div className='serverDash--controlPanel'>
                        {hasPerms || <div className='serverDash--noPermsOverlay'>
                            <span>You must have either the <strong className='noPerms-permission'>MANAGE SERVER</strong> or <strong className='noPerms-permission'>ADMINISTRATOR</strong> permission to configure this server!</span>
                            <div className='serverDash--noPermsOverlay-bg'></div>
                        </div>}
                        <h2 className='serverDash--controlPanel-title'>Management</h2>
                        <div className='serverDash--controlPanel-mangement'>
                            <SelectMenu
                                title='DJ Roles'
                                subTitle='Set DJ roles'
                                menuOptions={djSelectObj.shownOptions}
                                multiSelect={true}
                                placeHolder='Select multiple roles'
                                selectValues={djSelectObj.selectValues}
                                setSelectValues={updateDjSelectValues}
                                optionsVisible={djSelectObj.optionsVisible}
                                setOptionsVisible={toggleDjOptionsVisible}
                                searchText={djSelectObj.searchText}
                                setSearchText={updateDjSearchText}
                            />
                            <SelectMenu
                                title='Restricted Voice Channels'
                                subTitle='Set Voice Channels'
                                menuOptions={vcSelectObj.shownOptions}
                                multiSelect={true}
                                placeHolder='Select multiple channels'
                                selectValues={vcSelectObj.selectValues}
                                setSelectValues={updateVcSelectValues}
                                optionsVisible={vcSelectObj.optionsVisible}
                                setOptionsVisible={toggleVcOptionsVisible}
                                searchText={vcSelectObj.searchText}
                                setSearchText={updateVcSearchText}
                                isChannelMenu={true}
                                isVoiceMenu={true}
                            />
                            <SelectMenu
                                title='Restricted Text Channels'
                                subTitle='Set Text Channels'
                                menuOptions={tcSelectObj.shownOptions}
                                multiSelect={true}
                                placeHolder='Select multiple channels'
                                selectValues={tcSelectObj.selectValues}
                                setSelectValues={updateTcSelectValues}
                                optionsVisible={tcSelectObj.optionsVisible}
                                setOptionsVisible={toggleTcOptionsVisible}
                                searchText={tcSelectObj.searchText}
                                setSearchText={updateTcSearchText}
                                isChannelMenu={true}
                            />
                            <SelectMenu
                                title='Log Channel'
                                subTitle='Set the channel for Robertify logs to be sent'
                                menuOptions={lcSelectObj.shownOptions}
                                multiSelect={false}
                                placeHolder='Select a channel'
                                selectValues={lcSelectObj.selectValues}
                                setSelectValues={updateLcSelectValues}
                                optionsVisible={lcSelectObj.optionsVisible}
                                setOptionsVisible={toggleLcOptionsVisible}
                                searchText={lcSelectObj.searchText}
                                setSearchText={updateLcSearchText}
                                isChannelMenu={true}
                            />
                            <SelectMenu
                                title='Theme'
                                subTitle='Set the color theme for Roberify'
                                menuOptions={themeSelectObj.shownOptions}
                                multiSelect={false}
                                placeHolder='Select a channel'
                                selectValues={themeSelectObj.selectValues}
                                setSelectValues={updateThemeSelectValues}
                                optionsVisible={themeSelectObj.optionsVisible}
                                setOptionsVisible={toggleThemeOptionsVisible}
                                searchText={themeSelectObj.searchText}
                                setSearchText={updateThemeSearchText}
                            />
                        </div>
                        <hr className='serverDash--divider' />
                        <h2 className='serverDash--controlPanel-title'>Toggles</h2>
                        <div className='serverDash--controlPanel-toggles'>
                            <Toggle label='Restricted Voice Channels' subTitle='Should Robertify only be allowed to play in specific voice channels?' isActive={togglesState.restricted_voice_channels} setActive={() => toggleState('restricted_voice_channels')} />
                            <Toggle label='Restricted Text Channels' subTitle='Should Robertify commands only be allowed to be used in a specific channel?' isActive={togglesState.restricted_text_channels} setActive={() => toggleState('restricted_text_channels')}/>
                            <Toggle label='Show Requester' subTitle='Toggle if you want the song requester to be visible in now playing messages' isActive={togglesState.show_requester} setActive={() => toggleState('show_requester')}/>
                            <Toggle label='8ball' subTitle='Toggle if you want the 8ball module to be enabled in this server' isActive={togglesState['8ball']} setActive={() => toggleState('8ball')}/>
                            <Toggle label='Polls' subTitle='Toggle if you want polls to be enabled in this server' isActive={togglesState.polls} setActive={() => toggleState('polls')}/>
                            <Toggle label='Tips' subTitle='Toggle if you want tips to be enabled in this server' isActive={togglesState.tips} setActive={() => toggleState('tips')}/>
                            <Toggle label='Vote Skips' subTitle='Toggle if you want vote skips to be enabled in this server' isActive={togglesState.vote_skips} setActive={() => toggleState('vote_skips')}/>
                            <Toggle label='Announce Messages' subTitle='Toggle if you want Now Playing messages to be announced' isActive={togglesState.announce_messages} setActive={() => toggleState('announce_messages')}/>
                        </div>
                        <hr className='serverDash--divider' />
                        <h2 className='serverDash--controlPanel-title'>DJ Toggles</h2>
                        <div className='serverDash--controlPanel-toggles'>
                            {djToggles}
                        </div>
                        <hr className='serverDash--divider' />
                        <h2 className='serverDash--controlPanel-title'>Log Toggles</h2>
                        <div className='serverDash--controlPanel-toggles'>
                            {logToggles}
                        </div>
                        <hr className='serverDash--divider' />
                        <h2 className='serverDash--controlPanel-title'>8ball</h2>
                        <div className='serverDash--controlPanel-8ball'>
                            <TextOptionList
                                options={eightBallResponses}
                                addOption={addEightBallResponse}
                                removeOption={removeEightBallResponse}
                                inputValue={eightBallInput}
                                setInputValue={setEightBallInput}
                                placeholder='Add an 8ball response...'
                                noResponsesMsg='You have no custom responses...'
                            />
                        </div>
                        <hr className='serverDash--divider' />
                        <div className='serverDash--footer-buttons'>
                            <button className='button-md danger' onClick={reset}><img src='https://i.robertify.me/images/pup8a.png' alt='Reset Button'/>Reset</button>
                            <button className={`button-md primary ${!refreshAllowed && 'cursor-notAllowed'}`} onClick={refresh}><img src='https://i.robertify.me/images/v1u8p.png' alt='Refresh Button'/>Refresh</button>
                        </div>
                    </div>
                </div>
                <div className={`banner-lg bg-dark sticky-bottom ${changeMade ? 'active' : 'inactive'}`}>
                    <p>Careful - You have unsaved changes!</p>
                    <div className='serverDash--unsaved-buttons'>
                        <button className='button-md secondary' onClick={discard}><img src='https://i.robertify.me/images/pup8a.png' alt='Discard Button'/>Discard</button>
                        <button className='button-md primary' onClick={save}><img src='https://i.robertify.me/images/htbv7.png' alt='Save Button'/>Save</button>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const info = await fetchAllDiscordUserInfo(context.req);
    try {
        const guildInfo = await fetchDiscordGuildInfo(context.req, context.params.id)

        await robertifyAPI.setAccessToken();
        const dbGuildInfo = await robertifyAPI.getGuildInfo(context.params.id)
        const { access } = guildInfo;

        return {
            props: {
                token: info.props.token || null,
                userInfo: info.props.userInfo || null,
                guildInfo: info.props.guildInfo.filter(obj => obj.id === context.params.id)[0] || null,
                dbGuildInfo: dbGuildInfo || null,
                fullGuildInfo: access ? null : guildInfo,
                hasAccess: access === false ? false : true,
                localHostName: process.env.LOCAL_API_HOSTNAME,
                hostedHostName: process.env.HOSTED_API_HOSTNAME,
                hostedMasterPassword: process.env.API_MASTER_PASSWORD,
                botID: atob(process.env.DISCORD_BOT_TOKEN.split('.')[0])
            }
        }
    } catch (ex) {
        if (ex.response.status === 404)
            return {
                props: {
                    token: info.props.token || null,
                    userInfo: info.props.userInfo || null,
                    guildInfo: info.props.guildInfo.filter(obj => obj.id === context.params.id)[0] || null,
                    dbGuildInfo: null,
                    fullGuildInfo: null,
                    hasAccess: false,
                    localHostName: process.env.LOCAL_API_HOSTNAME,
                    hostedHostName: process.env.HOSTED_API_HOSTNAME,
                    hostedMasterPassword: process.env.API_MASTER_PASSWORD,
                    botID: atob(process.env.DISCORD_BOT_TOKEN.split('.')[0])
                }
            }
        else console.log(ex);
    }
}