import { useEffect, useState } from "react";
import config from "../../config";
import { useTheme } from "../../Theme/Theme";
import { authenticatedFetch } from "../../utils/api";
import ProfileCardMini from "../ProfileCardMini/ProfileCardMini";
import "./NewsSideBar.css";
function NewsSideBar() {
  const { theme, toggleTheme } = useTheme();
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(`${config.url}api/get-people/`, {
        method: "GET",
      });
      
      if (response?.ok) {
        const data = await response.json();
        console.log(data);
        setPeople(data);
      }
    } catch (error) {
      console.error("Error fetching people:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div
        className="screen-element sidebar"
        style={{
          backgroundColor: theme.element,
          flexDirection: 'column',
          gap: '10px',
          padding: '15px'
        }}
      >
        <div style={{ 
          color: theme.text_plain, 
          fontSize: 'calc(0.9rem + 0.3vw)',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          <h3>Suggested People</h3>
        </div>
        {people.map((person) => (
          <ProfileCardMini
            key={person.id}
            user={{
              id: person.id,
              username: person.username,
              firstName: person.first_name,
              lastName: person.last_name,
              bio: person.biography || "",
              profile_picture_avatar: person.profile_picture_avatar,
              profile_picture_type: person.profile_picture_type,
              is_following: person.is_following
            }}
          />
        ))}
      </div>
    </>
  );
}
export default NewsSideBar;
