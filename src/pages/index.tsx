import { Box, Button, Flex, Heading, Input, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";

const dummyData = ["Message 1", "Message 2"];

const client = new W3CWebSocket("ws://localhost:8080/ws");

const Index = () => {
	const [text, setText] = useState("");
	const [messages, setMessages] = useState(dummyData);

	useEffect(() => {
		client.onopen = () => {
			console.log("WebSocket Client Connected");
		};

		client.onmessage = (message) => {
			console.log("message: ", message);
		};
	}, []);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value);
	};

	const handleSend = () => {
		client.send(text);
		setText("");
	};

	return (
		<Container height="100vh">
			<DarkModeSwitch />
			<Heading>Websocket testing</Heading>
			<Flex p={8}>
				<Input w="50%" mr={8} value={text} onChange={handleChange}></Input>
				<Button colorScheme="teal" variant="outline" onClick={handleSend}>
					Send
				</Button>
			</Flex>

			<Box p={8}>
				<VStack spacing={4} align="stretch">
					{messages.map((m) => (
						<Box bg="teal" display="inline" shadow="md" p={2} borderRadius="10">
							{m}
						</Box>
					))}
				</VStack>
			</Box>
		</Container>
	);
};

export default Index;
