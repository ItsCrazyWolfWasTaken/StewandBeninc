# Example file showing a circle moving on screen
import pygame
import random
import math

# pygame setup
pygame.init()
screen = pygame.display.set_mode((1280, 720))
clock = pygame.time.Clock()
running = True
won = False
dt = 0
font = pygame.font.Font('freesansbold.ttf', 225)
fontend = pygame.font.Font('freesansbold.ttf', 25)
invulnerable = False

# spawn orb data set
while True:
    # spawn orb position and player spawn position, aswell as set up time function for invulnerability
    sporb = [random.randint(10, 1270), random.randint(10, 710)]
    player_pos = [sporb[0], sporb[1]]
    velocity = [0, 0]
    time = 0
    invulnerable = True

    # score orb eaten counter
    scorbcounter = 0

    # chase orb data set
    corb = [[random.randint(10, 1270), random.randint(10, 710),0,0,0,0,0,0,0,0] for a in range(random.randint(5,15))]

    # teleporting orb data set
    torb = [[random.randint(10, 1270), random.randint(10, 710)] for b in range(random.randint(12, 18))]

    # score orb data set
    sorb = [[random.randint(10, 1270), random.randint(10, 710), False] for c in range(random.randint(8,12))]

    def add(x, y):
        return [x[0] + y[0], x[1] + y[1]]

    stamina = 600
    unused = True

    while running:
        # poll for events
        # pygame.QUIT event means the user clicked X to close your window
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        # fill the screen with a color to wipe away anything from last frame
        screen.fill("black")

        # stamina bar for dashing
        pygame.draw.rect(screen, "white", (340 ,620, stamina, 10))

        # disables spawn invulnerability
        if time >= 180:
            invulnerable = False

        # draws score orbs
        temp = []
        for i in range(len(sorb)):
            temp = sorb[i]
            if not temp[2]:
                pygame.draw.circle(screen, "blue", (temp[0],temp[1]), 10)
                
        # checks if score orbs were eaten
        for j in range(len(sorb)):
            temp = []
            temp.append(sorb[j][0])
            temp.append(sorb[j][1])
            if math.dist(temp, player_pos) <= 22.0:
                sorb[j][2] = True
                sorb[j][1], sorb[j][0] = -100, -100
                scorbcounter += 1
                if stamina <= 550:
                    stamina += 50
                else:
                    stamina = 600
                                   
        # draws teleport orbs
        temp = []
        for k in range(len(torb)):
            temp = torb[k]
            pygame.draw.circle(screen, "green", (temp[0],temp[1]), 10)
        
        # checks if teleport orbs were used
        for l in range(len(torb)):
            temp = []
            temp.append(torb[l][0])
            temp.append(torb[l][1])
            if math.dist(temp, player_pos) <= 22.0:
                player_pos = sporb
        
        # draws spawn orb
        pygame.draw.circle(screen, "purple", (sporb[0],sporb[1]), 10)

        # draws chase orbs
        temp = []
        for k in range(len(corb)):
            temp = corb[k]
            pygame.draw.circle(screen, (random.randint(200,255),random.randint(50,150),0), (temp[0],temp[1]), 10)

        # checks if chase orbs ate player
        for d in range(len(corb)):
            temp = []
            temp.append(corb[d][0])
            temp.append(corb[d][1])
            if math.dist(temp, player_pos) <= 22.0 and not invulnerable:
                running = False
                won = False

        # draws player
        pygame.draw.circle(screen, (random.randint(50,255),random.randint(50,255),random.randint(50,255)), player_pos, 10)

        # moves chase orbs
        for i in range(len(corb)):
            corb[i][0] += corb[i][2] * dt
            corb[i][1] += corb[i][3] * dt

        # moves player
        keys = pygame.key.get_pressed()
        if keys[pygame.K_SPACE] and stamina > 0 and unused:
            velocity[0] *= 1.1
            velocity[1] *= 1.1
            stamina -= 20
        if keys[pygame.K_w]:
            velocity[1] -= 20 * dt
        if keys[pygame.K_s]:
            velocity[1] += 20 * dt
        if keys[pygame.K_a]:
            velocity[0] -= 20 * dt
        if keys[pygame.K_d]:
            velocity[0] += 20 * dt

        player_pos = add(player_pos, velocity)

        # gives players air resistance
        velocity = [velocity[0] * 0.95, velocity[1] * 0.95]

        # gives players bounce on the walls
        if player_pos[0] < 0:
            player_pos[0] -= player_pos[0] * 1.75
            velocity[0] *= -.75
        if player_pos[0] > 1280:
            player_pos[0] -= (player_pos[0] - 1280) * 1.75
            velocity[0] *= -.75
        if player_pos[1] < 0:
            player_pos[1] -= player_pos[1] * 1.75
            velocity[1] *= -.75
        if player_pos[1] > 720:
            player_pos[1] -= (player_pos[1] - 720) * 1.75
            velocity[1] *= -.75
        
        # refills stamina
        if stamina == 0:
            unused = False
        if stamina < 600:
            stamina += 1
        if stamina == 600:
            unused = True

        # sets chase orbs velocity
        for i in range(len(corb)):
            corb[i][4] = (player_pos[0]+10*velocity[0])-corb[i][0]
            corb[i][5] = (player_pos[1]+10*velocity[0])-corb[i][1]
            corb[i][6] = abs(corb[i][4])+abs(corb[i][5])
            corb[i][2] += 25*(corb[i][4]/corb[i][6])
            corb[i][3] += 25*(corb[i][5]/corb[i][6])
            for u in range(len(corb)):
                if not u == i:
                    corb[i][7] = corb[u][0]-corb[i][0]
                    corb[i][8] = corb[u][1]-corb[i][1]
                    corb[i][9] = abs(corb[i][7])+abs(corb[i][8])
                    corb[i][2] -= (corb[i][7]/corb[i][9])
                    corb[i][3] -= (corb[i][8]/corb[i][9])
            # for d in range(len(torb)):
            #     corb[i][10] = corb[i][0]-torb[d][0]
            #     corb[i][11] = corb[i][1]-torb[d][1]
            #     corb[i][12] = abs(corb[i][10])+abs(corb[i][11])
            #     corb[i][2] -= 2*(corb[i][10]/corb[i][12])
            #     corb[i][3] -= 2*(corb[i][11]/corb[i][12])

            # gives chase orbs air resistance
            corb[i][2] *= 0.95
            corb[i][3] *= 0.95

            # gives chase orbs bounce on the walls
            if corb[i][0] < 0:
                corb[i][0] -= corb[i][0] * 1.75
                corb[i][2] *= -.75
            if corb[i][0] > 1280:
                corb[i][0] -= (corb[i][0] - 1280) * 1.75
                corb[i][2] *= -.75
            if corb[i][1] < 0:
                corb[i][1] -= corb[i][1] * 1.75
                corb[i][3] *= -.75
            if corb[i][1] > 720:
                corb[i][1] -= (corb[i][1] - 720) * 1.75
                corb[i][3] *= -.75

            # lets chase orbs teleport through teleport orbs
            for p in range(len(torb)):
                temp = []
                temp.append(corb[i][0]) 
                temp.append(corb[i][1])
                temp2 = []
                temp2.append(torb[p][0]) 
                temp2.append(torb[p][1])
                if math.dist(temp, temp2) <= 22.0:
                    corb[i][0] = sporb[0]
                    corb[i][1] = sporb[1]

        # flip() the display to put your work on screen
        pygame.display.flip()

        if scorbcounter >= len(sorb):
            won = True
            running = False

        # limits FPS to 60
        # dt is delta time in seconds since last frame, used for framerate-
        # independent physics.
        time += 1
        dt = clock.tick(60) / 1000
    again = ""
    playagain = fontend.render('Play Again?', True, "#333333")
    leave = fontend.render('Quit?', True, "#333333")
    for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
    # game over
    if won == False:   
        pygame.draw.rect(screen, "black", (0,0,1280,720))
        text = font.render('Game Over', True, "red")
        textRect = text.get_rect()
        textRect.center = (1280 // 2, 720 // 2)
        screen.blit(text, textRect)
        againrect = playagain.get_rect()
        againrect.center = (2160 // 2, 1190 // 2)
        leaverect = leave.get_rect()
        leaverect.center = (400 // 2, 1190 // 2)
        pygame.draw.rect(screen, "white", (100, 570, 200, 50))
        pygame.draw.rect(screen, "white", (980, 570, 200, 50))
        screen.blit(playagain, againrect)
        screen.blit(leave, leaverect)
        x, y = 0, 0
        if event.type == pygame.MOUSEBUTTONDOWN:
            x, y = pygame.mouse.get_pos()
            print(f"{x},{y}")
        if x >= 100 and x <=300  and y >= 570 and y <= 620:
            again = "n"
        elif x >= 980 and x <=1180  and y >= 570 and y <= 620:
            again = "y"
        pygame.display.update()

    # game won
    if won == True:
        pygame.draw.rect(screen, "black", (0,0,1280,720))
        text = font.render('Game Won', True, "white")
        textRect = text.get_rect()
        textRect.center = (1280 // 2, 720 // 2)
        screen.blit(text, textRect)
        againrect = playagain.get_rect()
        againrect.center = (2160 // 2, 1190 // 2)
        leaverect = leave.get_rect()
        leaverect.center = (400 // 2, 1190 // 2)
        pygame.draw.rect(screen, "white", (100, 570, 200, 50))
        pygame.draw.rect(screen, "white", (980, 570, 200, 50))
        screen.blit(playagain, againrect)
        screen.blit(leave, leaverect)
        x, y = 0, 0
        if event.type == pygame.MOUSEBUTTONDOWN:
            x, y = pygame.mouse.get_pos()
            print(f"{x},{y}")
        if x >= 100 and x <=300  and y >= 570 and y <= 620:
            again = "n"
        elif x >= 980 and x <=1180  and y >= 570 and y <= 620:
            again = "y"
        pygame.display.update()
        won == False
        
    if again == "y":
        running = True
    elif again == "n":
        pygame.quit()