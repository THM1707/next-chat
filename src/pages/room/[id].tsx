import {
	Box,
	Button,
	Flex,
	Heading,
	Input,
	VStack,
	Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";
import { Container } from "../../components/Container";

const WS_URL = "ws://localhost:8000/room/";

interface Message {
	type: number;
	id: number;
	content: string;
}

const Room = () => {
	const router = useRouter();
	const { id } = router.query;
	const [messages, setMessages] = useState([]);
	const [text, setText] = useState("");
	const [ws, setWs] = useState<W3CWebSocket>();
	const [clientId, setClientId] = useState(-1);

	useEffect(() => {
		if (ws !== undefined) {
			return;
		}
		setWs(new W3CWebSocket(`${WS_URL}${id}`));
	}, [id]);

	useEffect(() => {
		ws.onopen = () => {
			console.log("WebSocket Client Connected");
		};

		ws.onmessage = (m: IMessageEvent) => {
			let message: Message = JSON.parse(m.data as any);
			if (message.type === 0) {
				setClientId(message.id);
			} else if (message.type === 2) {
				console.log(message.content);
			} else {
				setMessages((oldMessages) => [...oldMessages, message]);
			}
		};
	}, [id]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value);
	};

	const handleSend = () => {
		ws.send(text);
		setText("");
	};

	return (
		<Container>
			<Heading>Room {id}</Heading>
			<Flex p={8}>
				<Input w="50%" mr={8} value={text} onChange={handleChange}></Input>
				<Button colorScheme="teal" variant="outline" onClick={handleSend}>
					Send
				</Button>
			</Flex>

			<Box>
				<VStack spacing={2} align="stretch">
					{messages.map((m: Message) => (
						<Box
							align={m.id === clientId ? "right" : "left"}
							bg="teal"
							shadow="md"
							p={2}
							borderRadius="15"
							key={messages.indexOf(m)}
							w="50%"
						>
							<Text color="white">{m.content}</Text>
						</Box>
					))}
				</VStack>
			</Box>
		</Container>
	);
};

export function getServerSideProps(context: any) {
	return {
		props: { params: context.params },
	};
}

export default Room;
