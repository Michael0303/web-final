import { useState } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { useStyles } from '../hooks';
import axios from '../api';
import { useScoreCard } from '../hooks/useScoreCard';
import Table from './Table'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1em;
`;

const StyledFormControl = styled(FormControl)`
  min-width: 120px;
`;

const ContentPaper = styled(Paper)`
  height: 300px;
  padding: 2em;
  overflow: auto;
`;


const Body = () => {
    const classes = useStyles();

    const { messages, addCardMessage, addRegularMessage, addErrorMessage } =
        useScoreCard();

    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [score, setScore] = useState(0);

    const [queryType, setQueryType] = useState('name');
    const [queryString, setQueryString] = useState('');

    const [mode, setMode] = useState('add')
    const [item, setItem] = useState([])


    const handleChange = (func) => (event) => {
        func(event.target.value);
    };

    const handleSwitchTab = (event, newValue) => {
        setItem([])
        setMode(newValue);
    };


    const handleAdd = async () => {
        const {
            data: { message, card },
        } = await axios.post('/card', {
            name,
            subject,
            score,
        });
        console.log(card)
        if (!card) {
            addErrorMessage(message);
            setItem([])
        } else {
            const {
                data: { cards },
            } = await axios.get('/cards', {
                params: {
                    type: 'name',
                    queryString: name,
                },
            });
            console.log(cards)
            addCardMessage(message);
            setItem([...cards])
        }
    };

    const handleQuery = async () => {
        const {
            data: { messages, message, cards },
        } = await axios.get('/cards', {
            params: {
                type: queryType,
                queryString,
            },
        });

        if (!messages) {
            addErrorMessage(message);
            setItem([])
        } else {
            addRegularMessage(...messages);
            setItem([...cards])
        }

    };

    const AddTab =
        <Row>
            {/* Could use a form & a library for handling form data here such as Formik, but I don't really see the point... */}
            <TextField
                className={classes.input}
                placeholder="Name"
                value={name}
                onChange={handleChange(setName)}
            />
            <TextField
                className={classes.input}
                placeholder="Subject"
                style={{ width: 240 }}
                value={subject}
                onChange={handleChange(setSubject)}
            />
            <TextField
                className={classes.input}
                placeholder="Score"
                value={score}
                onChange={handleChange(setScore)}
                type="number"
            />
            <Button
                className={classes.button}
                variant="contained"
                color="primary"
                disabled={!name || !subject}
                onClick={handleAdd}
            >
                Add
            </Button>
        </Row>

    const QueryTab =
        <Row>
            <StyledFormControl>
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        value={queryType}
                        onChange={handleChange(setQueryType)}
                    >
                        <FormControlLabel
                            value="name"
                            control={<Radio color="primary" />}
                            label="Name"
                        />
                        <FormControlLabel
                            value="subject"
                            control={<Radio color="primary" />}
                            label="Subject"
                        />
                    </RadioGroup>
                </FormControl>
            </StyledFormControl>
            <TextField
                placeholder="Query string..."
                value={queryString}
                onChange={handleChange(setQueryString)}
                style={{ flex: 1 }}
            />
            <Button
                className={classes.button}
                variant="contained"
                color="primary"
                disabled={!queryString}
                onClick={handleQuery}
            >
                Query
            </Button>
        </Row>

    return (
        <Wrapper>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={mode} onChange={handleSwitchTab} aria-label="basic tabs example" centered>
                    <Tab label='ADD' value='add' />
                    <Tab label="QUERY" value='query' />
                </Tabs>
            </Box>
            {mode === 'add' ? AddTab : QueryTab}
            <ContentPaper variant="outlined">
                {messages.map((m, i) => (
                    <Typography variant="body2" key={m + i} style={{ color: m.color }}>
                        {m.message}
                    </Typography>
                ))}
                <Table rows={item} />
            </ContentPaper>
        </Wrapper>
    );
};

export default Body;
