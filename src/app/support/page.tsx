import HeadingSection from "@/components/heading-section";
import FAQCard from "@/app/support/faq-card";
import Card from "@/components/card";
import Button from "@/components/button/Button";
import discordIcon from '/public/discord.svg';

const faq = [
    {
        "title": "HOW CAN I CREATE A REQUEST CHANNEL?",
        "content": "You can easily create a request channel by running the <span className='markdown'>setup</span> command.\\n\\nYou must have the <span className='markdown'>Manage Server</span> permission to run that command, however.",
        "contentImg": "https://i.imgur.com/2UkFaQT.gif"
    },
    {
        "title": "HOW CAN I MAKE SOMEONE A DJ?",
        "content": "You can make someone a DJ by running the <span className='markdown'>setdj</span> command. You can remove DJs by running the <span className='markdown'>removedj</span> command. You can also list all DJs by running the <span className='markdown'>listdj</span> command.\\n\\nDJs will have special permissions to do certain things on Robertify. A majority of what DJs can do can be configured by you, the user. By running the <span className='markdown'>toggles dj list</span> command you can see which permissions are limited to DJs or not.",
        "contentImg": "https://i.imgur.com/hGBeDg7.gif"
    },
    {
        "title": "HOW CAN I MAKE SOMEONE AN ADMIN?",
        "content": "Setting someone as an admin is done through the <span className='markdown'>permissions</span> command. You can set either a <b>role</b> or <b>user</b> as an admin, similar to setting a DJ.\\n\\nThe syntax for setting an admin looks like:\\n<span className='markdown'>permissions add [role|user] (roleMention/userMention) ROBERTIFY_ADMIN</span>",
        "contentImg": "https://i.imgur.com/VLqqMyg.gif"
    },
    {
        "title": "HOW CAN I KEEP ROBERTIFY IN A VOICE CHANNEL 24/7?",
        "content": "Robertify can be left in a voice channel 24/7 by running the <span className='markdown'>247</span> command. This command is a <span className='text-primary'>premium</span> command."
    },
    {
        "title": "HOW CAN I RESTRICT COMMANDS TO CERTAIN PEOPLE?",
        "content": "Commands can be restricted to DJs by interacting with <span className='markdown'>toggles</span>. You can read the card relating to setting DJs to see how to give someone the permission.\\n\\nUpon the execution of <span className='markdown'>toggles dj list</span> you'll be shown which commands are limited to DJs and which aren't. The commands marked with a check signify that it is restricted to DJs only, and vice versa for X&apos;s.\\n\\nIn order to toggle certain commands as being DJ-only you must run the <span className='markdown'>toggles dj switch [command]</span> command.",
        "contentImg": "https://i.imgur.com/s4KzMGD.gif"
    },
    {
        "title": "HOW CAN I MAKE COMMANDS ONLY BE RAN IN CERTAIN CHANNELS?",
        "content": "You can limit commands to only be ran in specific channels by interaction with the <span className='markdown'>restrictedchannels</span> command.\\n\\nIn order to limit commands to only be sent to a specific channel, you must run the following command:\\n<span className='markdown'>restrictedchannels add [#channel]</span>\\n\\nAll admins will have the permission to use commands anywhere, regardless of restriction.\\n\\n<em><b>Note:</b> You must enable <span className='text-primary'>restrictedtext</span> in the <span className='markdown'>toggles</span> menu.</em>",
        "contentImg": "https://i.imgur.com/oHdBhTK.gif"
    },
    {
        "title": "HOW CAN I MAKE ROBERTIFY ONLY PLAY MUSIC IN SPECIFIC CHANNELS?",
        "content": "Similar to restricted text channels, you can limit voice channels in the same way.\\n\\nYou must run the command <span className='markdown'>restrictedchannels add [#voiceChannel]</span>.\\n\\nThe bot will <b>ONLY</b> be allowed to join the channels you restricted.\\n\\n<em><b>Note:</b> You must enable <span className='text-primary'>restrictedvoice</span> in the <span className='markdown'>toggles</span> menu.</em>",
        "contentImg": "https://i.imgur.com/FMsY3VN.gif"
    },
    {
        "title": "HOW CAN I CHANGE THE COLOUR OF ROBERTIFY?",
        "content": "You can easily change the colour of Robertify by running the <span className='markdown'>theme</span> command. This is a <span className='text-primary'>premium</span> command.",
        "contentImg": "https://i.imgur.com/njlmZwY.gif"
    },
    {
        "title": "HOW CAN I CHANGE ROBERTIFY'S LANGUAGE?",
        "content": "You can change Robertify&apos;s language by running the <span className='markdown'>language</span> command.\\n\\nAs of now, there are only 7 languages available: English (UK), Dutch, French, Russian, German, Portuguese and Spanish.\\n\\nThis command is limited to users that have the <span className='markdown'>ROBERTIFY_ADMIN</span> permission or Administrator permission in the corresponding server.",
        "contentImg": "https://i.imgur.com/FBeuRI0.gif"
    },
    {
        "title": "HOW CAN I ENABLE VOTE SKIPS?",
        "content": "In order to enable vote skips, you must first ensure that the <span className='markdown'>voteskips</span> toggle has been toggled on. Once toggled on, the bot will automatically make the <span className='markdown'>skip</span> command a DJ-only command. You can check that this is so by running the <span className='markdown'>toggles dj list</span> command and verifying.\\n\\nIf vote skips are toggled on and you still notice them not working, check your DJ toggles and ensure that the <span className='markdown'>skip</span> command is DJ-only."
    },
    {
        "title": "HOW CAN I REPORT A BUG?",
        "content": "You can easily report a bug by joining the <a href='https://discord.gg/P67szbJmrj'>support server</a> and opening a ticket. From there, you can report the bug to the developers.",
        "contentImg": "https://i.imgur.com/Y3oe8zp.gif"
    },
    {
        "title": "HOW CAN I MAKE A SUGGESTION?",
        "content": "You can easily make a suggestion to us by running the <span className='markdown'>suggest</span> command.",
        "contentImg": "https://i.imgur.com/1EVUx37.gif"
    },
    {
        "title": "WHERE CAN I GET HELP?",
        "content": "You can easily get help by joining the <a href='https://discord.gg/P67szbJmrj'>support server</a> and opening a ticket."
    },
    {
        "title": "DOES ROBERTIFY LISTEN TO MY CONVERSATIONS IN VOICE CHANNELS?",
        "content": "No, Robertify would never listen to any of your conversations, nor is there the means to do such a thing. Please take the time to view our privacy policy to see what information we collect."
    },
    {
        "title": "HOW CAN I BAN A USER IN MY SERVER FROM ROBERTIFY?",
        "content": "You can ban a user from Robertify by running the <span className='markdown'>ban</span> command. You can also unban a user by running the <span className='markdown'>unban</span> command.\\n\\nThis command doesn't ban a user from your server, instead it bans them from interacting with Robertify in your server. Meaning they will not be able to play songs, press buttons, run commands, etc.",
        "contentImg": "https://i.imgur.com/h9R2bx7.gif"
    }
]


export default function Support() {
    const cards = faq.map(q => <FAQCard key={q.title} title={q.title} content={q.content} contentImg={q.contentImg}/>)

    return (
        <main>
            <HeadingSection heading='Support' subheading='All the help you need!'/>
            <div className='p-12'>
                <div className='flex justify-center mb-12'>
                    <Card title='Need more help?' description='Join our support server!' size='sm'>
                        <Button label='Support Server'
                                icon={discordIcon}
                                width={10} height={3}
                                href='https://discord.gg/98dD6NbfDU'
                        />
                    </Card>
                </div>
                <div
                    className='grid grid-cols-3 phone:grid-cols-1 tablet:grid-cols-2 gap-6 tablet:gap-3 place-content-center'>
                    {cards}
                </div>
            </div>
        </main>
    )
}